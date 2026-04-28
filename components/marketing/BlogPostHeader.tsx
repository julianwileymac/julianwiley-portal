import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { brandColors } from "@/lib/theme";

interface Props {
  post: PostMeta & { readingMinutes: number };
}

export function BlogPostHeader({ post }: Props) {
  const date = new Date(post.isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <header style={{ marginBottom: 24 }}>
      <nav
        aria-label="Breadcrumb"
        style={{ marginBottom: 16, fontSize: 13, color: brandColors.textMuted }}
      >
        <Link href="/" style={{ color: brandColors.textMuted, textDecoration: "none" }}>
          Home
        </Link>{" "}
        /{" "}
        <Link href="/blog" style={{ color: brandColors.textMuted, textDecoration: "none" }}>
          Blog
        </Link>{" "}
        / <span style={{ color: brandColors.text }}>{post.title}</span>
      </nav>
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800,
          margin: "0 0 12px",
          lineHeight: 1.15,
          color: brandColors.text,
          letterSpacing: "-0.02em",
        }}
      >
        {post.title}
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          color: brandColors.textMuted,
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        <span>{date}</span>
        <span>· {post.readingMinutes} min read</span>
        {post.categories[0] && (
          <span
            style={{
              background: "rgba(37, 99, 235, 0.10)",
              color: brandColors.primary,
              padding: "2px 10px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {post.categories[0]}
          </span>
        )}
      </div>
      <p
        style={{
          fontSize: 18,
          color: brandColors.textMuted,
          margin: "0 0 16px",
          lineHeight: 1.55,
        }}
      >
        {post.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {post.tags.map((t) => (
          <span
            key={t}
            style={{
              background: brandColors.surfaceMuted,
              border: `1px solid ${brandColors.border}`,
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 12,
              color: brandColors.textMuted,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </header>
  );
}
