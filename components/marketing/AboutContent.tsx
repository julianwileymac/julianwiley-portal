"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { aboutData } from "@/lib/data/about";
import { experiences } from "@/lib/data/experiences";
import { degrees } from "@/lib/data/education";
import { accomplishments } from "@/lib/data/accomplishments";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

export function AboutContent() {
  return (
    <div style={{ background: "#fff" }}>
      <section
        style={{
          padding: "72px 32px 32px",
          background: brandColors.surfaceMuted,
          borderBottom: `1px solid ${brandColors.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
              padding: 4,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#fff",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={siteData.avatar}
                alt={siteData.name}
                width={150}
                height={150}
                style={{ borderRadius: "50%" }}
              />
            </div>
          </div>
          <div>
            <Text style={{ color: brandColors.primary, fontWeight: 600 }}>
              {aboutData.designation} @{" "}
              {aboutData.company.url ? (
                <a href={aboutData.company.url} target="_blank" rel="noopener noreferrer">
                  {aboutData.company.name}
                </a>
              ) : (
                aboutData.company.name
              )}
            </Text>
            <Title level={1} style={{ margin: "8px 0 16px", fontWeight: 800 }}>
              About {siteData.nickname}
            </Title>
            <Paragraph style={{ fontSize: 16, color: brandColors.textMuted, maxWidth: 720 }}>
              {aboutData.summary}
            </Paragraph>
            <Space>
              <a href={siteData.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button type="primary" icon={<DownloadOutlined />}>
                  Download Resume
                </Button>
              </a>
              <Link href="/contact">
                <Button>Get in Touch</Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      <section style={{ padding: "56px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Soft Skills
          </Title>
          <Row gutter={[20, 20]}>
            {aboutData.badges.map((b) => (
              <Col xs={24} sm={12} md={8} key={b.name}>
                <Card style={{ borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Text strong>{b.name}</Text>
                    <Text style={{ color: brandColors.textMuted }}>{b.percentage}%</Text>
                  </div>
                  <Progress percent={b.percentage} strokeColor={b.color} showInfo={false} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section style={{ padding: "32px 32px 56px", background: brandColors.surfaceMuted }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Experience
          </Title>
          <Timeline
            mode="left"
            items={experiences.map((exp) => ({
              color: brandColors.primary,
              children: (
                <Card style={{ marginBottom: 12, borderRadius: 12 }}>
                  <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
                    {exp.company.url ? (
                      <a href={exp.company.url} target="_blank" rel="noopener noreferrer">
                        {exp.company.name}
                      </a>
                    ) : (
                      exp.company.name
                    )}{" "}
                    <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>
                      — {exp.company.location}
                    </Text>
                  </Title>
                  <Paragraph style={{ color: brandColors.textMuted, marginBottom: 12 }}>
                    {exp.company.overview}
                  </Paragraph>
                  {exp.positions.map((pos) => (
                    <div key={pos.designation} style={{ marginBottom: 16 }}>
                      <Text strong>{pos.designation}</Text>
                      <Text type="secondary" style={{ marginLeft: 8 }}>
                        {pos.start} — {pos.end ?? "Present"}
                      </Text>
                      <ul style={{ marginTop: 8, color: brandColors.textMuted }}>
                        {pos.responsibilities.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Card>
              ),
            }))}
          />
        </div>
      </section>

      <section style={{ padding: "56px 32px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Education
          </Title>
          <Row gutter={[20, 20]}>
            {degrees.map((d) => (
              <Col xs={24} md={12} key={d.name}>
                <Card style={{ height: "100%", borderRadius: 12 }}>
                  <Title level={4} style={{ marginTop: 0 }}>
                    {d.name}
                  </Title>
                  <Text type="secondary">
                    {d.institution.url ? (
                      <a href={d.institution.url} target="_blank" rel="noopener noreferrer">
                        {d.institution.name}
                      </a>
                    ) : (
                      d.institution.name
                    )}{" "}
                    · {d.timeframe}
                  </Text>
                  {d.courses && d.courses.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <Text strong style={{ fontSize: 13 }}>
                        Selected Courses
                      </Text>
                      <ul style={{ marginTop: 4, color: brandColors.textMuted, paddingLeft: 20 }}>
                        {d.courses.map((c) => (
                          <li key={c.name}>{c.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {d.extracurricularActivities && d.extracurricularActivities.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <Text strong style={{ fontSize: 13 }}>
                        Extracurricular
                      </Text>
                      <ul style={{ marginTop: 4, color: brandColors.textMuted, paddingLeft: 20 }}>
                        {d.extracurricularActivities.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section style={{ padding: "32px 32px 80px", background: brandColors.surfaceMuted }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Accomplishments
          </Title>
          <Row gutter={[20, 20]}>
            {accomplishments.map((a) => (
              <Col xs={24} md={8} key={a.name}>
                <Card style={{ height: "100%", borderRadius: 12 }}>
                  <Tag color="blue" style={{ marginBottom: 8 }}>
                    {a.timeline}
                  </Tag>
                  <Title level={5} style={{ marginTop: 0 }}>
                    {a.name}
                  </Title>
                  <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                    {a.organization.url ? (
                      <a href={a.organization.url} target="_blank" rel="noopener noreferrer">
                        {a.organization.name}
                      </a>
                    ) : (
                      a.organization.name
                    )}
                  </Text>
                  <Paragraph style={{ color: brandColors.textMuted, fontSize: 14 }}>
                    {a.overview}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
}
