"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  GithubOutlined,
  RocketOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { PageContainer, ProCard } from "@/components/pro";
import type { Project } from "@/lib/data/projects";
import type { PostMeta } from "@/lib/mdx";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

const tabs = [
  { key: "overview", tab: "Overview" },
  { key: "tech", tab: "Tech Stack" },
  { key: "highlights", tab: "Highlights" },
  { key: "posts", tab: "Related Posts" },
];

interface Props {
  project: Project;
  relatedPosts: PostMeta[];
}

export function ProjectDetail({ project, relatedPosts }: Props) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <PageContainer
      header={{
        title: project.name,
        subTitle: project.role,
        breadcrumb: {
          items: [
            { title: <Link href="/">Home</Link> },
            { title: <Link href="/projects">Projects</Link> },
            { title: project.name },
          ],
        },
        extra: [
          project.repo ? (
            <a key="repo" href={project.repo} target="_blank" rel="noopener noreferrer">
              <Button icon={<GithubOutlined />}>Repository</Button>
            </a>
          ) : null,
          <Link key="dashboard" href={`/app/projects/${project.slug}`}>
            <Button type="primary" icon={<RocketOutlined />}>
              Open in Dashboard
            </Button>
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
            {project.featured && <Tag color="gold">Featured</Tag>}
          </Space>
        ),
      }}
      tabList={tabs}
      tabActiveKey={activeTab}
      onTabChange={setActiveTab}
      content={
        <Paragraph style={{ color: brandColors.textMuted, fontSize: 16, marginBottom: 0 }}>
          {project.summary}
        </Paragraph>
      }
      style={{ background: "#f8fafc" }}
    >
      {activeTab === "overview" && (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <ProCard title="About this project" bordered>
              <Paragraph style={{ fontSize: 15, color: brandColors.text }}>
                {project.description}
              </Paragraph>
            </ProCard>
          </Col>
          <Col xs={24} md={8}>
            <ProCard title="At a glance" bordered>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Role">{project.role}</Descriptions.Item>
                <Descriptions.Item label="Timeline">{project.timeline}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  {project.status.replace("-", " ")}
                </Descriptions.Item>
                <Descriptions.Item label="Category">{project.category}</Descriptions.Item>
              </Descriptions>
            </ProCard>
          </Col>
        </Row>
      )}

      {activeTab === "tech" && (
        <ProCard title="Tech Stack" bordered>
          <Space wrap size={[8, 12]}>
            {project.technologies.map((t) => (
              <Tag key={t} color="blue" style={{ fontSize: 14, padding: "4px 12px" }}>
                {t}
              </Tag>
            ))}
          </Space>
          <Title level={5} style={{ marginTop: 24 }}>
            Tags
          </Title>
          <Space wrap size={[8, 8]}>
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </Space>
        </ProCard>
      )}

      {activeTab === "highlights" && (
        <ProCard title="Highlights" bordered>
          <List
            dataSource={project.highlights}
            renderItem={(h) => (
              <List.Item>
                <Text style={{ fontSize: 15 }}>• {h}</Text>
              </List.Item>
            )}
          />
        </ProCard>
      )}

      {activeTab === "posts" && (
        <ProCard title="Related Blog Posts" bordered>
          {relatedPosts.length === 0 ? (
            <Empty description="No related posts yet." />
          ) : (
            <List
              itemLayout="vertical"
              dataSource={relatedPosts}
              renderItem={(post) => (
                <List.Item
                  key={post.slug}
                  extra={
                    <Link href={`/blog/${post.slug}`}>
                      <Button type="link" icon={<ArrowRightOutlined />}>
                        Read
                      </Button>
                    </Link>
                  }
                >
                  <List.Item.Meta
                    title={
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    }
                    description={
                      <Space split="·">
                        <Text type="secondary">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                        {post.tags.slice(0, 4).map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </Space>
                    }
                  />
                  <Paragraph style={{ color: brandColors.textMuted, marginBottom: 0 }}>
                    {post.description}
                  </Paragraph>
                </List.Item>
              )}
            />
          )}
        </ProCard>
      )}
    </PageContainer>
  );
}
