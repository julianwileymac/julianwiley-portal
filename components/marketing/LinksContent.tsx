"use client";

import { Card, Col, Row, Tag, Typography } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { links } from "@/lib/data/links";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

const iconFor = (icon: string) => {
  switch (icon) {
    case "github":
      return <GithubOutlined />;
    case "linkedin":
      return <LinkedinOutlined />;
    case "mail":
      return <MailOutlined />;
    default:
      return <LinkOutlined />;
  }
};

const categoryColor: Record<string, string> = {
  social: "blue",
  code: "purple",
  writing: "geekblue",
  tools: "cyan",
};

export function LinksContent() {
  return (
    <div style={{ padding: "72px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Title level={1} style={{ fontWeight: 800, marginBottom: 8 }}>
          Links
        </Title>
        <Paragraph style={{ color: brandColors.textMuted, fontSize: 17, marginBottom: 32 }}>
          Where to find me and my work elsewhere on the web.
        </Paragraph>
        <Row gutter={[20, 20]}>
          {links.map((link) => (
            <Col xs={24} sm={12} key={link.name}>
              <a
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Card hoverable style={{ height: "100%", borderRadius: 12 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {iconFor(link.icon)}
                    </div>
                    <div>
                      <Tag color={categoryColor[link.category]} style={{ textTransform: "capitalize" }}>
                        {link.category}
                      </Tag>
                      <Title level={5} style={{ margin: "6px 0 4px" }}>
                        {link.name}
                      </Title>
                      <Text style={{ color: brandColors.textMuted, fontSize: 13 }}>
                        {link.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
