import type { Metadata } from "next";
import { getAllPostMeta } from "@/lib/mdx";
import { BlogIndex } from "@/components/marketing/BlogIndex";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing on data engineering, MLOps, agents, and homelab Kubernetes.",
};

export default function BlogIndexPage() {
  const posts = getAllPostMeta();
  return <BlogIndex posts={posts} />;
}
