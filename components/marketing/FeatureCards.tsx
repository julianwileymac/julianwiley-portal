"use client";

import Link from "next/link";
import { Card, Col, Row, Tag, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { featuredProjects } from "@/lib/data/projects";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph } = Typography;

export function FeatureCards() {
  return (
    <section style={{ padding: "80px 32px", background: brandColors.surfaceMuted }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Featured Projects
          </Title>
          <Paragraph style={{ color: brandColors.textMuted, fontSize: 17, marginTop: 8 }}>
            A selection of professional and personal work — full catalog on the{" "}
            <Link href="/projects">Projects</Link> page.
          </Paragraph>
        </div>
        <Row gutter={[24, 24]}>
          {featuredProjects.map((p) => (
            <Col xs={24} md={12} lg={8} key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                style={{ textDecoration: "none", display: "block", height: "100%" }}
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    border: `1px solid ${brandColors.border}`,
                    borderRadius: 14,
                  }}
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
                  </div>
                  <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
                    {p.name}
                  </Title>
                  <Paragraph
                    style={{
                      color: brandColors.textMuted,
                      marginBottom: 16,
                      minHeight: 48,
                    }}
                  >
                    {p.summary}
                  </Paragraph>
                  <div style={{ marginBottom: 16 }}>
                    {p.technologies.slice(0, 4).map((t) => (
                      <Tag key={t} style={{ marginBottom: 4 }}>
                        {t}
                      </Tag>
                    ))}
                  </div>
                  <span style={{ color: brandColors.primary, fontWeight: 600 }}>
                    Read more <ArrowRightOutlined />
                  </span>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
