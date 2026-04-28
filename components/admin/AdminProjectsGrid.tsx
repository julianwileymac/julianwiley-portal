"use client";

import { Col, Row } from "antd";
import { PageContainer } from "@/components/pro";
import { ProjectStatusCard } from "@/components/admin/ProjectStatusCard";
import type { Project } from "@/lib/data/projects";

export function AdminProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <PageContainer
      header={{
        title: "Projects",
        subTitle: "Operations rooms for every project surfaced on the public site.",
      }}
    >
      <Row gutter={[16, 16]}>
        {projects.map((p) => (
          <Col key={p.slug} xs={24} md={12} xl={8}>
            <ProjectStatusCard project={p} />
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
}
