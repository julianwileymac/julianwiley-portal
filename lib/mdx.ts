import "server-only";

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const POSTS_DIR = join(process.cwd(), "content", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  categories: string[];
  /** ISO date string for sorting. */
  isoDate: string;
}

export interface PostFull extends PostMeta {
  content: string;
  readingMinutes: number;
}

interface RawFrontMatter {
  title?: string;
  date?: string | Date;
  description?: string;
  tags?: string[] | string;
  categories?: string[] | string;
}

function normalizeListField(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === "string") return [value];
  return [];
}

function readPostFile(slug: string): { data: RawFrontMatter; content: string } | undefined {
  const path = join(POSTS_DIR, `${slug}.mdx`);
  if (!existsSync(path)) return undefined;
  const raw = readFileSync(path, "utf-8");
  const parsed = matter(raw);
  return { data: parsed.data as RawFrontMatter, content: parsed.content };
}

function listPostSlugs(): string[] {
  if (!existsSync(POSTS_DIR)) return [];
  return readdirSync(POSTS_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
}

function toPostMeta(slug: string, data: RawFrontMatter): PostMeta {
  const dateRaw = data.date ?? new Date(0).toISOString();
  const dateObj = dateRaw instanceof Date ? dateRaw : new Date(String(dateRaw));
  const isoDate = isNaN(dateObj.getTime()) ? "1970-01-01T00:00:00.000Z" : dateObj.toISOString();
  return {
    slug,
    title: data.title ?? slug,
    date: typeof data.date === "string" ? data.date : isoDate,
    isoDate,
    description: data.description ?? "",
    tags: normalizeListField(data.tags),
    categories: normalizeListField(data.categories),
  };
}

export function getAllPostMeta(): PostMeta[] {
  return listPostSlugs()
    .map((slug) => {
      const file = readPostFile(slug);
      if (!file) return undefined;
      return toPostMeta(slug, file.data);
    })
    .filter((p): p is PostMeta => Boolean(p))
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));
}

export function getPostBySlug(slug: string): PostFull | undefined {
  const file = readPostFile(slug);
  if (!file) return undefined;
  const meta = toPostMeta(slug, file.data);
  // Rough reading time: 220 wpm.
  const words = file.content.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 220));
  return { ...meta, content: file.content, readingMinutes };
}

export function getRelatedPosts(slug: string, tags: string[], limit = 4): PostMeta[] {
  if (tags.length === 0) return [];
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  return getAllPostMeta()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => tagSet.has(t.toLowerCase())).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.post.isoDate < b.post.isoDate ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.post);
}

export function getAdjacentPosts(slug: string): { prev?: PostMeta; next?: PostMeta } {
  const all = getAllPostMeta(); // sorted newest first
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    next: i > 0 ? all[i - 1] : undefined,
    prev: i < all.length - 1 ? all[i + 1] : undefined,
  };
}
