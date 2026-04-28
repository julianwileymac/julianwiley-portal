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
  title: "Docs",
  description: "Setup, deployment, and authoring guides for the portal and supporting tools.",
};

export default function DocsIndexPage() {
  const root = getContentBySlug("docs", []);
  if (!root) notFound();
  const sidebar = getSidebar("docs");
  return (
    <KnowledgeShell
      kind="docs"
      sectionTitle="Docs"
      sectionSummary="Project setup, authoring guides, and deployment runbooks."
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
