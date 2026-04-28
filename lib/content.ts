import "server-only";

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import matter from "gray-matter";

/**
 * Generic loader for nested .mdx content trees (notes/, docs/). Both trees
 * use the same on-disk layout the migration script produces:
 *
 *   content/<kind>/index.mdx                  -> /<kind>
 *   content/<kind>/<a>/index.mdx              -> /<kind>/<a>
 *   content/<kind>/<a>/<b>.mdx                -> /<kind>/<a>/<b>
 *
 * Sections (`index.mdx` files) act as parents and contribute the section
 * label / weight that drives sidebar ordering.
 */

export type ContentKind = "notes" | "docs";

export interface ContentMeta {
  /** URL slug parts after /<kind>/ — empty array means the section root. */
  slugParts: string[];
  title: string;
  description?: string;
  weight: number;
  /** True for `index.mdx` files (sections). */
  isSection: boolean;
  /** Parent slug parts (used to build the tree). */
  parentParts: string[];
}

export interface ContentFull extends ContentMeta {
  content: string;
}

export interface SidebarNode {
  meta: ContentMeta;
  children: SidebarNode[];
}

interface RawFrontMatter {
  title?: string;
  description?: string;
  weight?: number | string;
}

function root(kind: ContentKind): string {
  return join(process.cwd(), "content", kind);
}

function readFrontMatter(absPath: string): { data: RawFrontMatter; content: string } {
  const raw = readFileSync(absPath, "utf-8");
  const parsed = matter(raw);
  return { data: parsed.data as RawFrontMatter, content: parsed.content };
}

function listMdxFiles(absRoot: string): string[] {
  if (!existsSync(absRoot)) return [];
  const out: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const abs = join(dir, entry);
      if (statSync(abs).isDirectory()) walk(abs);
      else if (entry.endsWith(".mdx")) out.push(abs);
    }
  }
  walk(absRoot);
  return out;
}

function toMeta(absRoot: string, absPath: string, raw: RawFrontMatter): ContentMeta {
  const rel = relative(absRoot, absPath).split(sep);
  const isSection = rel[rel.length - 1] === "index.mdx";
  const slugParts = isSection ? rel.slice(0, -1) : [...rel.slice(0, -1), rel[rel.length - 1].replace(/\.mdx$/, "")];
  const parentParts = slugParts.slice(0, -1);
  const weightRaw = raw.weight;
  const weight = typeof weightRaw === "number" ? weightRaw : Number(weightRaw ?? 9999);
  return {
    slugParts,
    parentParts,
    title: raw.title ?? slugParts[slugParts.length - 1] ?? "Untitled",
    description: raw.description,
    weight: Number.isFinite(weight) ? weight : 9999,
    isSection,
  };
}

function loadAll(kind: ContentKind): { full: Map<string, ContentFull> } {
  const absRoot = root(kind);
  const files = listMdxFiles(absRoot);
  const map = new Map<string, ContentFull>();
  for (const abs of files) {
    const { data, content } = readFrontMatter(abs);
    const meta = toMeta(absRoot, abs, data);
    map.set(meta.slugParts.join("/"), { ...meta, content });
  }
  return { full: map };
}

export function getAllContentMeta(kind: ContentKind): ContentMeta[] {
  const all = [...loadAll(kind).full.values()].map((entry) => {
    const { content: _content, ...meta } = entry;
    void _content;
    return meta;
  });
  return all.sort((a, b) => a.weight - b.weight || a.title.localeCompare(b.title));
}

export function getContentBySlug(
  kind: ContentKind,
  slugParts: string[],
): ContentFull | undefined {
  const key = slugParts.join("/");
  return loadAll(kind).full.get(key);
}

/** All non-empty slugs for `generateStaticParams`. */
export function getContentSlugs(kind: ContentKind): { slug: string[] }[] {
  return getAllContentMeta(kind)
    .filter((m) => m.slugParts.length > 0)
    .map((m) => ({ slug: m.slugParts }));
}

/** Build a section-tree for sidebar rendering. */
export function getSidebar(kind: ContentKind): SidebarNode[] {
  const all = getAllContentMeta(kind);
  const byParent = new Map<string, ContentMeta[]>();
  for (const meta of all) {
    if (meta.slugParts.length === 0) continue; // skip the kind-root
    const parentKey = meta.parentParts.join("/");
    if (!byParent.has(parentKey)) byParent.set(parentKey, []);
    byParent.get(parentKey)!.push(meta);
  }
  function build(parentKey: string): SidebarNode[] {
    const items = (byParent.get(parentKey) ?? []).slice().sort(
      (a, b) => a.weight - b.weight || a.title.localeCompare(b.title),
    );
    return items.map((meta) => ({ meta, children: build(meta.slugParts.join("/")) }));
  }
  return build("");
}
