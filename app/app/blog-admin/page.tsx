import { notFound } from "next/navigation";
import { getAllPostMeta } from "@/lib/mdx";
import { siteData } from "@/lib/data/site";
import { getAccess } from "@/lib/access";
import { BlogAdminContent } from "@/components/admin/BlogAdminContent";

export default async function BlogAdminPage() {
  const access = await getAccess();
  if (!access.can.viewBlogAdmin) notFound();

  const posts = getAllPostMeta().map((p) => ({
    ...p,
    editUrl: `https://github.com/${siteData.github}/julianwiley-portal/edit/main/content/posts/${p.slug}.mdx`,
  }));

  return <BlogAdminContent posts={posts} />;
}
