import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  getContentBySlug,
  getContentSlugs,
  getSidebar,
} from "@/lib/content";
import { KnowledgeShell } from "@/components/marketing/KnowledgeShell";
import { stripUnportedShortcodes } from "@/lib/markdown";

interface Params {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getContentSlugs("docs");
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const doc = getContentBySlug("docs", slug);
  if (!doc) return { title: "Doc not found" };
  return {
    title: `${doc.title} — Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: Params) {
  const { slug } = await params;
  const doc = getContentBySlug("docs", slug);
  if (!doc) notFound();
  const sidebar = getSidebar("docs");

  return (
    <KnowledgeShell
      kind="docs"
      sectionTitle="Docs"
      sectionSummary="Project setup, authoring guides, and deployment runbooks."
      sidebar={sidebar}
    >
      <h1>{doc.title}</h1>
      {doc.description && <p>{doc.description}</p>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      >
        {stripUnportedShortcodes(doc.content)}
      </ReactMarkdown>
    </KnowledgeShell>
  );
}
