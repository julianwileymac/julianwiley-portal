import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  getAllPostMeta,
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/mdx";
import { BlogPostHeader } from "@/components/marketing/BlogPostHeader";
import { BlogPostAside } from "@/components/marketing/BlogPostAside";
import { brandColors } from "@/lib/theme";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.isoDate,
      tags: post.tags,
    },
  };
}

/** Strip the residual MDX-only `<UnportedShortcode>` JSX tags from legacy
 * template posts so `react-markdown` doesn't choke on the embedded JSX. */
function stripUnportedShortcodes(content: string): string {
  return content.replace(
    /<UnportedShortcode source=\{(.+?)\}\s*\/>/gs,
    (_, sourceJson) => {
      try {
        const code = JSON.parse(sourceJson);
        return `\n> ⚠️ **Unported Hugo shortcode (manual conversion needed):** \`${String(code).replace(/`/g, "'")}\`\n`;
      } catch {
        return "\n> ⚠️ **Unported Hugo shortcode (manual conversion needed)**\n";
      }
    }
  );
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.tags);
  const { prev, next } = getAdjacentPosts(post.slug);
  const cleaned = stripUnportedShortcodes(post.content);

  return (
    <article style={{ background: "#fff", padding: "48px 32px 80px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <BlogPostHeader post={post} />

        <div className="prose-mdx" style={{ fontSize: 16, lineHeight: 1.7 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ]}
          >
            {cleaned}
          </ReactMarkdown>
        </div>

        <BlogPostAside related={related} prev={prev} next={next} />
      </div>

      <style>{`
        .prose-mdx h2 { font-size: 28px; font-weight: 700; margin: 32px 0 12px; color: ${brandColors.text}; }
        .prose-mdx h3 { font-size: 22px; font-weight: 700; margin: 24px 0 10px; color: ${brandColors.text}; }
        .prose-mdx h4 { font-size: 18px; font-weight: 700; margin: 20px 0 8px; color: ${brandColors.text}; }
        .prose-mdx p  { margin: 12px 0; color: #1f2937; }
        .prose-mdx ul, .prose-mdx ol { margin: 12px 0; padding-left: 24px; color: #1f2937; }
        .prose-mdx li { margin-bottom: 4px; }
        .prose-mdx a  { color: ${brandColors.primary}; text-decoration: none; }
        .prose-mdx a:hover { text-decoration: underline; }
        .prose-mdx code { background: ${brandColors.surfaceMuted}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .prose-mdx pre { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 10px; overflow-x: auto; margin: 16px 0; }
        .prose-mdx pre code { background: transparent; padding: 0; color: inherit; font-size: 14px; }
        .prose-mdx blockquote { border-left: 4px solid ${brandColors.primary}; padding-left: 16px; margin: 16px 0; color: ${brandColors.textMuted}; font-style: italic; }
        .prose-mdx table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        .prose-mdx th, .prose-mdx td { border: 1px solid ${brandColors.border}; padding: 8px 12px; text-align: left; }
        .prose-mdx th { background: ${brandColors.surfaceMuted}; font-weight: 700; }
        .prose-mdx img { max-width: 100%; height: auto; border-radius: 8px; }
        .prose-mdx hr { border: none; border-top: 1px solid ${brandColors.border}; margin: 32px 0; }
      `}</style>
    </article>
  );
}
