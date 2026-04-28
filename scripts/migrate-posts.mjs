#!/usr/bin/env node
// Migrate Hugo content from julianwileymac.github.io to this repo with
// cleaned front matter and best-effort Hugo shortcode replacements. Handles
// three trees:
//   posts/  -> flat content/posts/<slug>.mdx (one file per blog post)
//   notes/  -> nested content/notes/<path>.mdx (Bash, Go basics + advanced)
//   docs/   -> nested content/docs/<path>.mdx (Getting Started, Guides, ...)
//
// Usage:
//   node scripts/migrate-posts.mjs               # migrate posts (default)
//   node scripts/migrate-posts.mjs --kind notes
//   node scripts/migrate-posts.mjs --kind docs
//   node scripts/migrate-posts.mjs --kind all
//
// Idempotent: re-running overwrites the destination .mdx files.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((arg, i, all) => {
    if (arg.startsWith("--")) return [[arg.slice(2), all[i + 1]]];
    return [];
  })
);

const hugoRoot =
  args.hugoRoot ?? resolve(repoRoot, "..", "julianwileymac.github.io");
const imageDestRoot = resolve(repoRoot, "public");
const kind = (args.kind ?? "posts").toLowerCase();
const validKinds = new Set(["posts", "notes", "docs", "all"]);
if (!validKinds.has(kind)) {
  console.error(`--kind must be one of: ${[...validKinds].join(", ")}`);
  process.exit(1);
}

/** Hugo shortcodes we recognize and how to convert them to MDX. */
function convertShortcodes(body, slug) {
  let out = body;

  // {{< note >}}...{{< /note >}}  -> <Note>...</Note>
  out = out.replace(/{{<\s*note\s*>}}([\s\S]*?){{<\s*\/note\s*>}}/g, "<Note>$1</Note>");

  // {{< callout type="warning" >}}...{{< /callout >}}
  out = out.replace(
    /{{<\s*callout(?:\s+type="(\w+)")?\s*>}}([\s\S]*?){{<\s*\/callout\s*>}}/g,
    (_, type, inner) => `<Callout type="${type ?? "info"}">${inner}</Callout>`
  );

  // {{< mermaid >}}...{{< /mermaid >}}  -> <Mermaid>...</Mermaid>
  out = out.replace(
    /{{<\s*mermaid\s*>}}([\s\S]*?){{<\s*\/mermaid\s*>}}/g,
    (_, inner) => `<Mermaid>{\`${inner.replace(/`/g, "\\`")}\`}</Mermaid>`
  );

  // {{< embed-pdf url="..." >}}  -> <EmbedPdf url="..." />
  out = out.replace(/{{<\s*embed-pdf\s+url="([^"]+)"\s*>}}/g, '<EmbedPdf url="$1" />');

  // {{< toc-inline >}}  -> <TocInline />
  out = out.replace(/{{<\s*toc-inline\s*\/?\s*>}}/g, "<TocInline />");

  // {{< tech-stack ... >}}  -> warning banner (hand-port required)
  out = out.replace(/{{<\s*tech-stack[\s\S]*?>}}/g, (m) => {
    return `\n<UnportedShortcode source={${JSON.stringify(m)}} />\n`;
  });

  // {{< project-showcase ... >}}{{< /project-showcase >}}
  out = out.replace(
    /{{<\s*project-showcase[\s\S]*?{{<\s*\/project-showcase\s*>}}/g,
    (m) => `\n<UnportedShortcode source={${JSON.stringify(m)}} />\n`
  );

  // {{< code-tabs ... >}}{{< /code-tabs >}}
  out = out.replace(
    /{{<\s*code-tabs[\s\S]*?{{<\s*\/code-tabs\s*>}}/g,
    (m) => `\n<UnportedShortcode source={${JSON.stringify(m)}} />\n`
  );

  // Catch any remaining shortcodes — replace with a visible warning
  out = out.replace(/{{<[\s\S]*?>}}/g, (m) => {
    console.warn(`  [${slug}] unrecognized shortcode: ${m.slice(0, 80)}…`);
    return `\n<UnportedShortcode source={${JSON.stringify(m)}} />\n`;
  });

  return out;
}

/** Minimal YAML front matter parser — preserves keys as-is, strips `menu:` block. */
function parseAndCleanFrontMatter(raw) {
  if (!raw.startsWith("---")) {
    return { frontMatter: {}, body: raw };
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { frontMatter: {}, body: raw };

  const fmText = raw.slice(3, end).replace(/^\r?\n/, "");
  const body = raw.slice(end + 4).replace(/^\r?\n/, "");

  // Strip the `menu:` block (it's Hugo-specific sidebar config).
  const lines = fmText.split(/\r?\n/);
  const cleaned = [];
  let skipBlock = false;
  for (const line of lines) {
    if (/^menu:\s*$/.test(line)) {
      skipBlock = true;
      continue;
    }
    if (skipBlock) {
      // Stop skipping when we hit a top-level (non-indented) key again.
      if (/^[a-zA-Z]/.test(line)) {
        skipBlock = false;
      } else {
        continue;
      }
    }
    cleaned.push(line);
  }

  return {
    frontMatterText: cleaned.join("\n").trim(),
    body,
  };
}

/** Rewrite images referenced as /images/... or relative ./asset.png. */
function rewriteImages(body, sourceDir, destImageRoot, slug) {
  return body.replace(
    /!\[([^\]]*)\]\((?!https?:)([^)]+)\)/g,
    (full, alt, src) => {
      if (src.startsWith("/")) return full;
      const cleanSrc = src.replace(/^\.\//, "");
      const sourcePath = join(sourceDir, cleanSrc);
      if (existsSync(sourcePath)) {
        const destDir = join(imageDestRoot, "images", destImageRoot, slug);
        mkdirSync(destDir, { recursive: true });
        copyFileSync(sourcePath, join(destDir, cleanSrc));
        return `![${alt}](/images/${destImageRoot}/${slug}/${cleanSrc})`;
      }
      return full;
    }
  );
}

/** Migrate a flat `posts/<slug>/index.md` tree (each post is one folder). */
function migratePosts() {
  const sourceRoot = resolve(hugoRoot, "content", "posts");
  const destRoot = resolve(repoRoot, "content", "posts");
  if (!existsSync(sourceRoot)) {
    console.warn(`[posts] source not found: ${sourceRoot}`);
    return;
  }
  mkdirSync(destRoot, { recursive: true });

  const slugDirs = readdirSync(sourceRoot).filter((name) => {
    const p = join(sourceRoot, name);
    return statSync(p).isDirectory() && existsSync(join(p, "index.md"));
  });

  let migrated = 0;
  const flagged = [];

  for (const slug of slugDirs) {
    const sourceFile = join(sourceRoot, slug, "index.md");
    const destFile = join(destRoot, `${slug}.mdx`);
    const raw = readFileSync(sourceFile, "utf-8");

    const { frontMatterText, body } = parseAndCleanFrontMatter(raw);
    let mdxBody = convertShortcodes(body, slug);
    mdxBody = rewriteImages(mdxBody, join(sourceRoot, slug), "posts", slug);

    if (/<UnportedShortcode/.test(mdxBody)) flagged.push(slug);

    const out = `---\n${frontMatterText}\n---\n\n${mdxBody.trimStart()}\n`;
    writeFileSync(destFile, out, "utf-8");
    migrated += 1;
  }

  console.log(`\n[posts] migrated ${migrated} files -> ${destRoot}`);
  if (flagged.length > 0) {
    console.log(`[posts] ${flagged.length} flagged for manual review:`);
    flagged.forEach((s) => console.log(`  - content/posts/${s}.mdx`));
  }
}

/**
 * Walk a Hugo nested page bundle (notes/, docs/) and emit MDX preserving
 * the URL slug shape:
 *   <root>/_index.md                    -> <kind>/index.mdx
 *   <root>/<a>/_index.md                -> <kind>/<a>/index.mdx
 *   <root>/<a>/<b>/index.md             -> <kind>/<a>/<b>.mdx
 */
function migrateBundleTree(kindName) {
  const sourceRoot = resolve(hugoRoot, "content", kindName);
  const destRoot = resolve(repoRoot, "content", kindName);
  if (!existsSync(sourceRoot)) {
    console.warn(`[${kindName}] source not found: ${sourceRoot}`);
    return;
  }
  mkdirSync(destRoot, { recursive: true });

  const flagged = [];
  let migrated = 0;

  function walk(absDir, relParts) {
    const entries = readdirSync(absDir);
    for (const entry of entries) {
      const abs = join(absDir, entry);
      if (statSync(abs).isDirectory()) {
        walk(abs, [...relParts, entry]);
        continue;
      }

      let isSection = false;
      let isLeaf = false;
      if (entry === "_index.md") isSection = true;
      else if (entry === "index.md") isLeaf = true;
      else continue;

      const raw = readFileSync(abs, "utf-8");
      const { frontMatterText, body } = parseAndCleanFrontMatter(raw);
      const slug = relParts.join("/") || "(root)";
      let mdxBody = convertShortcodes(body, slug);
      mdxBody = rewriteImages(mdxBody, absDir, kindName, slug.replace(/\//g, "-"));
      if (/<UnportedShortcode/.test(mdxBody)) flagged.push(slug);

      let destFile;
      if (isSection) {
        const dir = relParts.length === 0 ? destRoot : join(destRoot, ...relParts);
        mkdirSync(dir, { recursive: true });
        destFile = join(dir, "index.mdx");
      } else {
        // leaf: <kind>/<a>/<b>/index.md -> <kind>/<a>/<b>.mdx
        const parent = relParts.slice(0, -1);
        const file = relParts[relParts.length - 1] + ".mdx";
        const dir = parent.length === 0 ? destRoot : join(destRoot, ...parent);
        mkdirSync(dir, { recursive: true });
        destFile = join(dir, file);
      }

      const out = `---\n${frontMatterText}\n---\n\n${mdxBody.trimStart()}\n`;
      writeFileSync(destFile, out, "utf-8");
      migrated += 1;
    }
  }

  walk(sourceRoot, []);
  console.log(`\n[${kindName}] migrated ${migrated} files -> ${destRoot}`);
  if (flagged.length > 0) {
    console.log(`[${kindName}] ${flagged.length} flagged for manual review:`);
    flagged.forEach((s) => console.log(`  - content/${kindName}/${s}`));
  }
}

if (kind === "posts" || kind === "all") migratePosts();
if (kind === "notes" || kind === "all") migrateBundleTree("notes");
if (kind === "docs" || kind === "all") migrateBundleTree("docs");
