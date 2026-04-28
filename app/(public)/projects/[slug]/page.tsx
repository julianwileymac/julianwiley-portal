import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/data/projects";
import { getAllPostMeta } from "@/lib/mdx";
import { ProjectDetail } from "@/components/marketing/ProjectDetail";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const allPosts = getAllPostMeta();
  const slugSet = new Set(project.relatedPosts ?? []);
  const relatedPosts = allPosts
    .filter((p) => slugSet.has(p.slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return <ProjectDetail project={project} relatedPosts={relatedPosts} />;
}
