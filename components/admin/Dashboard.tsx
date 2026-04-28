"use client";

import { Typography } from "antd";
import { PageContainer } from "@/components/pro";
import { KpiRow } from "@/components/admin/KpiRow";
import { DashboardCharts } from "@/components/admin/DashboardCharts";

const { Paragraph } = Typography;

interface Props {
  greeting: string;
  projectsCount: number;
  postsCount: number;
  servicesCount: number;
  lastUpdated: string;
}

export function Dashboard({
  greeting,
  projectsCount,
  postsCount,
  servicesCount,
  lastUpdated,
}: Props) {
  return (
    <PageContainer
      header={{
        title: greeting,
        subTitle: "Personal portal control panel",
      }}
    >
      <KpiRow
        projectsCount={projectsCount}
        postsCount={postsCount}
        servicesCount={servicesCount}
        lastUpdated={lastUpdated}
      />
      <DashboardCharts />
      <Paragraph style={{ marginTop: 16, color: "#64748b", fontSize: 13 }}>
        Quick links to project deployments live under <a href="/app/projects">Projects</a>;
        cluster ingress hosts default to <code>*.local</code> until they are added to the
        Cloudflare Tunnel ingress list in <code>rpi_kubernetes/kubernetes/base-services/cloudflared/</code>.
      </Paragraph>
    </PageContainer>
  );
}
