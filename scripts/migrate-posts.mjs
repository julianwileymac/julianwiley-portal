#!/usr/bin/env node
// Migrate Hugo posts from julianwileymac.github.io/content/posts/<slug>/index.md
// to this repo's content/posts/<slug>.mdx with cleaned front matter and
// best-effort Hugo shortcode replacements.
//
// Usage:  node scripts/migrate-posts.mjs [--source <path>]
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

const sourceRoot =
  args.source ??
  resolve(repoRoot, "..", "julianwileymac.github.io", "content", "posts");
const destRoot = resolve(repoRoot, "content", "posts");
const imageSourceRoot = resolve(repoRoot, "..", "julianwileymac.github.io", "static");
const imageDestRoot = resolve(repoRoot, "public");

if (!existsSync(sourceRoot)) {
  console.error(`Source not found: ${sourceRoot}`);
  process.exit(1);
}

mkdirSync(destRoot, { recursive: true });

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
function rewriteImages(body, slug) {
  // Hugo posts may reference local images relative to the post folder.
  // We map them to /images/posts/<slug>/<file>. There were no local images
  // in this corpus, but the rewriter is here for future-proofing.
  return body.replace(
    /!\[([^\]]*)\]\((?!https?:)([^)]+)\)/g,
    (full, alt, src) => {
      if (src.startsWith("/")) return full;
      // Rewrite `./foo.png` or `foo.png` -> /images/posts/<slug>/foo.png
      const cleanSrc = src.replace(/^\.\//, "");
      const sourcePath = join(sourceRoot, slug, cleanSrc);
      if (existsSync(sourcePath)) {
        const destDir = join(imageDestRoot, "images", "posts", slug);
        mkdirSync(destDir, { recursive: true });
        copyFileSync(sourcePath, join(destDir, cleanSrc));
        return `![${alt}](/images/posts/${slug}/${cleanSrc})`;
      }
      return full;
    }
  );
}

const slugDirs = readdirSync(sourceRoot).filter((name) => {
  const p = join(sourceRoot, name);
  return statSync(p).isDirectory() && existsSync(join(p, "index.md"));
});

let migrated = 0;
let warnings = 0;
const summary = [];

for (const slug of slugDirs) {
  const sourceFile = join(sourceRoot, slug, "index.md");
  const destFile = join(destRoot, `${slug}.mdx`);
  const raw = readFileSync(sourceFile, "utf-8");

  const { frontMatterText, body } = parseAndCleanFrontMatter(raw);
  const beforeShortcode = body;
  let mdxBody = convertShortcodes(body, slug);
  mdxBody = rewriteImages(mdxBody, slug);

  const hasUnported = /<UnportedShortcode/.test(mdxBody);
  if (hasUnported) warnings += 1;

  const out = `---\n${frontMatterText}\n---\n\n${mdxBody.trimStart()}\n`;
  writeFileSync(destFile, out, "utf-8");

  summary.push({ slug, hasUnported, byteCount: out.length, changed: beforeShortcode !== mdxBody });
  migrated += 1;
}

console.log(`\nMigrated ${migrated} posts → ${destRoot}`);
console.log(`Posts with unported shortcodes (need manual review): ${warnings}`);
if (warnings > 0) {
  console.log("Files needing review:");
  summary.filter((s) => s.hasUnported).forEach((s) => console.log(`  - content/posts/${s.slug}.mdx`));
}
