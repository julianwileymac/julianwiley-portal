import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";
import { brandColors } from "@/lib/theme";

interface Props {
  related: PostMeta[];
  prev?: PostMeta;
  next?: PostMeta;
}

const linkCard = {
  display: "block",
  padding: "12px 14px",
  background: "#fff",
  border: `1px solid ${brandColors.border}`,
  borderRadius: 10,
  textDecoration: "none",
  color: "inherit",
  transition: "border-color 0.15s ease",
};

export function BlogPostAside({ related, prev, next }: Props) {
  return (
    <div style={{ marginTop: 56 }}>
      {related.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 12px",
              color: brandColors.text,
            }}
          >
            Related Posts
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}
          >
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} style={linkCard}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: brandColors.text }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: brandColors.textMuted, marginBottom: 6 }}>
                  {new Date(p.isoDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div style={{ fontSize: 13, color: brandColors.textMuted }}>
                  {p.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {prev ? (
          <Link href={`/blog/${prev.slug}`} style={linkCard}>
            <div style={{ fontSize: 12, color: brandColors.textMuted }}>← Previous</div>
            <div style={{ fontWeight: 700, marginTop: 4, color: brandColors.text }}>
              {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            style={{ ...linkCard, textAlign: "right" }}
          >
            <div style={{ fontSize: 12, color: brandColors.textMuted }}>Next →</div>
            <div style={{ fontWeight: 700, marginTop: 4, color: brandColors.text }}>
              {next.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
