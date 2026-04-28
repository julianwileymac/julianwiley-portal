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
  return getContentSlugs("notes");
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = getContentBySlug("notes", slug);
  if (!note) return { title: "Note not found" };
  return {
    title: `${note.title} — Notes`,
    description: note.description,
  };
}

export default async function NotePage({ params }: Params) {
  const { slug } = await params;
  const note = getContentBySlug("notes", slug);
  if (!note) notFound();
  const sidebar = getSidebar("notes");

  return (
    <KnowledgeShell
      kind="notes"
      sectionTitle="Notes"
      sectionSummary="Quick references for languages, shells, and tools."
      sidebar={sidebar}
    >
      <h1>{note.title}</h1>
      {note.description && <p>{note.description}</p>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      >
        {stripUnportedShortcodes(note.content)}
      </ReactMarkdown>
    </KnowledgeShell>
  );
}
