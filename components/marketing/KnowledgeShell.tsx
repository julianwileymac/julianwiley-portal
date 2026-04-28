"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Typography } from "antd";
import { brandColors } from "@/lib/theme";
import type { SidebarNode } from "@/lib/content";

const { Title, Text } = Typography;

interface Props {
  kind: "notes" | "docs";
  sectionTitle: string;
  sectionSummary?: string;
  sidebar: SidebarNode[];
  children: React.ReactNode;
}

function activeClass(href: string, current: string): React.CSSProperties {
  const isActive = current === href || current.startsWith(href + "/");
  return {
    display: "block",
    padding: "4px 8px",
    margin: "1px 0",
    borderRadius: 6,
    fontSize: 13,
    color: isActive ? brandColors.primary : brandColors.textMuted,
    background: isActive ? "rgba(37, 99, 235, 0.10)" : "transparent",
    fontWeight: isActive ? 600 : 500,
    textDecoration: "none",
  };
}

function SidebarTree({ kind, nodes }: { kind: string; nodes: SidebarNode[] }) {
  const current = usePathname() ?? "";
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {nodes.map((node) => {
        const href = `/${kind}/${node.meta.slugParts.join("/")}`;
        return (
          <li key={href} style={{ marginBottom: 2 }}>
            <Link href={href} style={activeClass(href, current)}>
              {node.meta.title}
            </Link>
            {node.children.length > 0 && (
              <div style={{ paddingLeft: 12, borderLeft: `1px solid ${brandColors.border}`, marginLeft: 8, marginTop: 2 }}>
                <SidebarTree kind={kind} nodes={node.children} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function KnowledgeShell({ kind, sectionTitle, sectionSummary, sidebar, children }: Props) {
  return (
    <div style={{ background: "#fff", padding: "48px 32px 80px" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(220px, 280px) 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        <aside
          style={{
            position: "sticky",
            top: 88,
            maxHeight: "calc(100vh - 96px)",
            overflowY: "auto",
            paddingRight: 8,
          }}
        >
          <Link href={`/${kind}`} style={{ textDecoration: "none", display: "block", marginBottom: 12 }}>
            <Title level={4} style={{ margin: 0, color: brandColors.text }}>
              {sectionTitle}
            </Title>
          </Link>
          {sectionSummary && (
            <Text type="secondary" style={{ display: "block", marginBottom: 16, fontSize: 13 }}>
              {sectionSummary}
            </Text>
          )}
          <SidebarTree kind={kind} nodes={sidebar} />
        </aside>
        <article className="prose-mdx" style={{ minWidth: 0, fontSize: 16, lineHeight: 1.7 }}>
          {children}
        </article>
      </div>

      <style>{`
        .prose-mdx h1 { font-size: 36px; font-weight: 800; margin: 0 0 16px; letter-spacing: -0.02em; color: ${brandColors.text}; }
        .prose-mdx h2 { font-size: 26px; font-weight: 700; margin: 28px 0 10px; color: ${brandColors.text}; }
        .prose-mdx h3 { font-size: 20px; font-weight: 700; margin: 20px 0 8px; color: ${brandColors.text}; }
        .prose-mdx p  { margin: 12px 0; color: #1f2937; }
        .prose-mdx ul, .prose-mdx ol { margin: 12px 0; padding-left: 24px; color: #1f2937; }
        .prose-mdx li { margin-bottom: 4px; }
        .prose-mdx a  { color: ${brandColors.primary}; text-decoration: none; }
        .prose-mdx a:hover { text-decoration: underline; }
        .prose-mdx code { background: ${brandColors.surfaceMuted}; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .prose-mdx pre  { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 10px; overflow-x: auto; margin: 16px 0; }
        .prose-mdx pre code { background: transparent; padding: 0; color: inherit; font-size: 14px; }
        .prose-mdx blockquote { border-left: 4px solid ${brandColors.primary}; padding-left: 16px; margin: 16px 0; color: ${brandColors.textMuted}; font-style: italic; }
        .prose-mdx table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        .prose-mdx th, .prose-mdx td { border: 1px solid ${brandColors.border}; padding: 8px 12px; text-align: left; }
        .prose-mdx th { background: ${brandColors.surfaceMuted}; font-weight: 700; }
        .prose-mdx hr { border: none; border-top: 1px solid ${brandColors.border}; margin: 32px 0; }
      `}</style>
    </div>
  );
}
