"use client";

import Link from "next/link";
import { Card, Space, Tag, Typography } from "antd";
import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import type { PostMeta } from "@/lib/mdx";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  return (
    <div style={{ padding: "72px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <Title level={1} style={{ fontWeight: 800, marginBottom: 8 }}>
          Blog
        </Title>
        <Paragraph style={{ color: brandColors.textMuted, fontSize: 17, marginBottom: 32 }}>
          Technical writing on data engineering, MLOps, agentic AI, and the
          homelab Kubernetes platform that hosts most of these projects.{" "}
          <Text type="secondary">
            ({posts.length} {posts.length === 1 ? "post" : "posts"})
          </Text>
        </Paragraph>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card hoverable style={{ borderRadius: 12 }}>
                <Space size={12} style={{ marginBottom: 8 }} wrap>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    <CalendarOutlined /> {formatDate(post.isoDate)}
                  </Text>
                  {post.categories[0] && (
                    <Tag color="blue">{post.categories[0]}</Tag>
                  )}
                </Space>
                <Title level={3} style={{ margin: "0 0 8px" }}>
                  {post.title}
                </Title>
                <Paragraph style={{ color: brandColors.textMuted, marginBottom: 12 }}>
                  {post.description}
                </Paragraph>
                <Space wrap size={[6, 6]} style={{ marginBottom: 12 }}>
                  {post.tags.slice(0, 5).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </Space>
                <div>
                  <span style={{ color: brandColors.primary, fontWeight: 600 }}>
                    Read post <ArrowRightOutlined />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
