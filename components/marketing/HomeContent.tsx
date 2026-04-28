"use client";

import { Card, Col, Row, Typography } from "antd";
import { Hero } from "@/components/marketing/Hero";
import { FeatureCards } from "@/components/marketing/FeatureCards";
import { skills } from "@/lib/data/skills";

const { Title, Paragraph } = Typography;

export function HomeContent() {
  return (
    <>
      <Hero />
      <FeatureCards />

      <section style={{ padding: "80px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <Title
            level={2}
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            What I Work With
          </Title>
          <Paragraph style={{ color: "#475569", fontSize: 17, marginTop: 8, marginBottom: 32 }}>
            Day-to-day stack across data engineering, ML platforms, and cloud / homelab operations.
          </Paragraph>
          <Row gutter={[16, 16]}>
            {skills.map((s) => (
              <Col xs={12} sm={8} md={6} key={s.name}>
                <Card
                  size="small"
                  style={{ height: "100%", borderRadius: 12 }}
                  styles={{ body: { display: "flex", gap: 12, alignItems: "flex-start" } }}
                >
                  <div style={{ fontSize: 24, lineHeight: 1 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                      {s.summary}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </>
  );
}
