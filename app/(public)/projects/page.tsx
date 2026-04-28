"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Card,
  Col,
  Empty,
  Row,
  Segmented,
  Space,
  Tag,
  Typography,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { projects } from "@/lib/data/projects";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

const filters = [
  { label: "All", value: "all" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
] as const;

type Filter = (typeof filters)[number]["value"];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <div style={{ padding: "72px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Title level={1} style={{ fontWeight: 800, marginBottom: 8 }}>
          Projects
        </Title>
        <Paragraph style={{ color: brandColors.textMuted, fontSize: 17, marginBottom: 24 }}>
          A working list of professional and personal projects. Click any card
          for the full write-up, tech stack, and linked blog posts.
        </Paragraph>
        <Space style={{ marginBottom: 32 }}>
          <Segmented
            size="large"
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            options={filters as unknown as { label: string; value: string }[]}
          />
        </Space>

        {visible.length === 0 ? (
          <Empty description="No projects in this category yet." />
        ) : (
          <Row gutter={[24, 24]}>
            {visible.map((p) => (
              <Col xs={24} md={12} lg={8} key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <Card
                    hoverable
                    style={{ height: "100%", borderRadius: 14 }}
                  >
                    <div style={{ marginBottom: 12 }}>
                      <Tag
                        color={p.category === "professional" ? "blue" : "purple"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {p.category}
                      </Tag>
                      <Tag
                        color={p.status === "in-progress" ? "processing" : "default"}
                        style={{ textTransform: "capitalize" }}
                      >
                        {p.status.replace("-", " ")}
                      </Tag>
                      {p.featured && <Tag color="gold">Featured</Tag>}
                    </div>
                    <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
                      {p.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {p.role} · {p.timeline}
                    </Text>
                    <Paragraph style={{ color: brandColors.textMuted, marginTop: 12, marginBottom: 16, minHeight: 60 }}>
                      {p.summary}
                    </Paragraph>
                    <div style={{ marginBottom: 16 }}>
                      {p.technologies.slice(0, 5).map((t) => (
                        <Tag key={t} style={{ marginBottom: 4 }}>
                          {t}
                        </Tag>
                      ))}
                    </div>
                    <span style={{ color: brandColors.primary, fontWeight: 600 }}>
                      View project <ArrowRightOutlined />
                    </span>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
