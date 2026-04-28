"use client";

import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Col,
  List,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { GithubOutlined, LinkOutlined } from "@ant-design/icons";
import { PageContainer, ProCard, ProDescriptions } from "@/components/pro";
import type { Project } from "@/lib/data/projects";
import type { PostMeta } from "@/lib/mdx";
import { brandColors } from "@/lib/theme";

const { Paragraph, Text } = Typography;

interface Props {
  project: Project;
  relatedPosts: PostMeta[];
}

export function AdminProjectDetail({ project, relatedPosts }: Props) {
  const deployments = project.deployments ?? [];

  return (
    <PageContainer
      header={{
        title: project.name,
        subTitle: project.role,
        breadcrumb: {
          items: [
            { title: <Link href="/app">Dashboard</Link> },
            { title: <Link href="/app/projects">Projects</Link> },
            { title: project.name },
          ],
        },
        extra: [
          project.repo ? (
            <a key="repo" href={project.repo} target="_blank" rel="noopener noreferrer">
              <Button icon={<GithubOutlined />}>Repository</Button>
            </a>
          ) : null,
          <Link key="public" href={`/projects/${project.slug}`}>
            <Button>Public page</Button>
          </Link>,
        ],
        tags: (
          <Space>
            <Tag color={project.category === "professional" ? "blue" : "purple"}>
              {project.category}
            </Tag>
            <Tag color={project.status === "in-progress" ? "processing" : "default"}>
              {project.status.replace("-", " ")}
            </Tag>
          </Space>
        ),
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <ProCard title="Overview" bordered>
            <Paragraph style={{ fontSize: 15 }}>{project.description}</Paragraph>
            <ProDescriptions
              column={2}
              dataSource={project}
              columns={[
                { title: "Role", dataIndex: "role" },
                { title: "Timeline", dataIndex: "timeline" },
                {
                  title: "Status",
                  dataIndex: "status",
                  renderText: (text) => (text as string).replace("-", " "),
                },
                { title: "Category", dataIndex: "category" },
              ]}
            />
          </ProCard>

          <ProCard title="Highlights" bordered style={{ marginTop: 16 }}>
            <List
              dataSource={project.highlights}
              renderItem={(h) => (
                <List.Item>
                  <Text>{h}</Text>
                </List.Item>
              )}
            />
          </ProCard>

          {relatedPosts.length > 0 && (
            <ProCard title="Linked Blog Posts" bordered style={{ marginTop: 16 }}>
              <List
                dataSource={relatedPosts}
                renderItem={(post) => (
                  <List.Item
                    extra={
                      <Link href={`/blog/${post.slug}`}>
                        <Button type="link">Read</Button>
                      </Link>
                    }
                  >
                    <List.Item.Meta
                      title={<Link href={`/blog/${post.slug}`}>{post.title}</Link>}
                      description={post.description}
                    />
                  </List.Item>
                )}
              />
            </ProCard>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <ProCard title="Live Deployments" bordered>
            {deployments.length === 0 ? (
              <Alert
                showIcon
                type="info"
                message="No deployments registered yet."
                description="Add entries under deployments[] in lib/data/projects.ts to surface them here."
              />
            ) : (
              <Space direction="vertical" style={{ width: "100%" }}>
                {deployments.map((d) => (
                  <Tooltip
                    key={d.name}
                    title={
                      d.internal
                        ? "LAN-only — only reachable on the homelab network."
                        : "Reachable via Cloudflare Tunnel"
                    }
                  >
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: brandColors.surfaceMuted,
                        textDecoration: "none",
                        color: brandColors.text,
                      }}
                    >
                      <span>
                        <Badge
                          status={d.internal ? "warning" : "success"}
                          style={{ marginRight: 8 }}
                        />
                        <Text strong>{d.name}</Text>
                        {d.namespace && (
                          <Text type="secondary" style={{ marginLeft: 6, fontSize: 12 }}>
                            ({d.namespace})
                          </Text>
                        )}
                      </span>
                      <LinkOutlined style={{ color: brandColors.primary }} />
                    </a>
                  </Tooltip>
                ))}
              </Space>
            )}
          </ProCard>

          <ProCard title="Tech Stack" bordered style={{ marginTop: 16 }}>
            <Space wrap>
              {project.technologies.map((t) => (
                <Tag key={t} color="blue">
                  {t}
                </Tag>
              ))}
            </Space>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
}
