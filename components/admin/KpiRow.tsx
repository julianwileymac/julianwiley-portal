"use client";

import { StatisticCard } from "@ant-design/pro-components";
import { ProCard } from "@ant-design/pro-components";
import {
  ProjectOutlined,
  EditOutlined,
  CloudServerOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { brandColors } from "@/lib/theme";

interface Props {
  projectsCount: number;
  postsCount: number;
  servicesCount: number;
  lastUpdated: string;
}

export function KpiRow({ projectsCount, postsCount, servicesCount, lastUpdated }: Props) {
  return (
    <ProCard split="vertical" bordered headerBordered style={{ borderRadius: 14 }}>
      <StatisticCard
        statistic={{
          title: "Projects",
          value: projectsCount,
          icon: <ProjectOutlined style={{ color: brandColors.primary, fontSize: 24 }} />,
        }}
      />
      <StatisticCard
        statistic={{
          title: "Blog Posts",
          value: postsCount,
          icon: <EditOutlined style={{ color: brandColors.accent, fontSize: 24 }} />,
        }}
      />
      <StatisticCard
        statistic={{
          title: "K8s Services",
          value: servicesCount,
          suffix: "tracked",
          icon: <CloudServerOutlined style={{ color: brandColors.success, fontSize: 24 }} />,
        }}
      />
      <StatisticCard
        statistic={{
          title: "Last Update",
          value: lastUpdated,
          icon: <ClockCircleOutlined style={{ color: brandColors.warning, fontSize: 24 }} />,
        }}
      />
    </ProCard>
  );
}
