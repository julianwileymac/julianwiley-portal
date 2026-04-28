"use client";

import Link from "next/link";
import { Badge, Card, Space, Tag, Tooltip, Typography } from "antd";
import { CloudServerOutlined, LinkOutlined, RocketOutlined } from "@ant-design/icons";
import type { Project } from "@/lib/data/projects";
import { brandColors } from "@/lib/theme";

const { Title, Text, Paragraph } = Typography;

interface Props {
  project: Project;
}

export function ProjectStatusCard({ project }: Props) {
  const deployments = project.deployments ?? [];
  return (
    <Card
      hoverable
      style={{ borderRadius: 14, height: "100%" }}
      styles={{ body: { display: "flex", flexDirection: "column", gap: 12 } }}
    >
      <div>
        <Space style={{ marginBottom: 8 }}>
          <Tag color={project.category === "professional" ? "blue" : "purple"}>
            {project.category}
          </Tag>
          <Tag color={project.status === "in-progress" ? "processing" : "default"}>
            {project.status.replace("-", " ")}
          </Tag>
        </Space>
        <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
          {project.name}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {project.role} · {project.timeline}
        </Text>
      </div>
      <Paragraph style={{ color: brandColors.textMuted, marginBottom: 0 }}>
        {project.summary}
      </Paragraph>

      {deployments.length > 0 && (
        <div>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 6 }}>
            <CloudServerOutlined /> Deployments
          </Text>
          {deployments.map((d) => (
            <Tooltip
              key={d.name}
              title={d.internal ? "LAN-only (not exposed via Cloudflare Tunnel)" : "Reachable via tunnel"}
            >
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: brandColors.surfaceMuted,
                  marginBottom: 4,
                  textDecoration: "none",
                  color: brandColors.text,
                }}
              >
                <span>
                  <Badge
                    status={d.internal ? "warning" : "success"}
                    style={{ marginRight: 6 }}
                  />
                  {d.name}
                  {d.namespace && (
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>
                      ({d.namespace})
                    </Text>
                  )}
                </span>
                <LinkOutlined style={{ color: brandColors.primary }} />
              </a>
            </Tooltip>
          ))}
        </div>
      )}

      <Space style={{ marginTop: "auto" }}>
        <Link href={`/app/projects/${project.slug}`}>
          <span style={{ color: brandColors.primary, fontWeight: 600 }}>
            <RocketOutlined /> Open project room
          </span>
        </Link>
      </Space>
    </Card>
  );
}
