import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/data/projects";
import { getAllPostMeta } from "@/lib/mdx";
import { AdminProjectDetail } from "@/components/admin/AdminProjectDetail";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function AdminProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const allPosts = getAllPostMeta();
  const slugSet = new Set(project.relatedPosts ?? []);
  const relatedPosts = allPosts.filter((p) => slugSet.has(p.slug));

  return <AdminProjectDetail project={project} relatedPosts={relatedPosts} />;
}
