import { getAllPostMeta } from "@/lib/mdx";
import { siteData } from "@/lib/data/site";
import { BlogAdminContent } from "@/components/admin/BlogAdminContent";

export default function BlogAdminPage() {
  const posts = getAllPostMeta().map((p) => ({
    ...p,
    editUrl: `https://github.com/${siteData.github}/julianwiley-portal/edit/main/content/posts/${p.slug}.mdx`,
  }));

  return <BlogAdminContent posts={posts} />;
}
