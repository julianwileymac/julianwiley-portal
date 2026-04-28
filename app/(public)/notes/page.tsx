import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getContentBySlug, getSidebar } from "@/lib/content";
import { KnowledgeShell } from "@/components/marketing/KnowledgeShell";
import { stripUnportedShortcodes } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Notes",
  description: "Quick references and snippets for languages, tools, and workflows.",
};

export default function NotesIndexPage() {
  const root = getContentBySlug("notes", []);
  if (!root) notFound();
  const sidebar = getSidebar("notes");
  return (
    <KnowledgeShell
      kind="notes"
      sectionTitle="Notes"
      sectionSummary="Quick references for languages, shells, and tools."
      sidebar={sidebar}
    >
      <h1>{root.title}</h1>
      {root.description && <p>{root.description}</p>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
      >
        {stripUnportedShortcodes(root.content)}
      </ReactMarkdown>
    </KnowledgeShell>
  );
}
