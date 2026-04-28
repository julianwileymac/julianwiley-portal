"use client";

import dynamic from "next/dynamic";
import { ProCard } from "@ant-design/pro-components";

const Area = dynamic(() => import("@ant-design/plots").then((m) => m.Area), { ssr: false });
const Pie = dynamic(() => import("@ant-design/plots").then((m) => m.Pie), { ssr: false });

const visits = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  visits: 30 + Math.round(Math.sin(i / 4) * 18 + Math.random() * 12),
}));

const tagBreakdown = [
  { type: "Kubernetes", value: 18 },
  { type: "MLOps", value: 14 },
  { type: "Agents", value: 11 },
  { type: "Quant", value: 8 },
  { type: "Security", value: 7 },
];

export function DashboardCharts() {
  return (
    <ProCard
      ghost
      gutter={16}
      style={{ marginTop: 16 }}
      wrap
    >
      <ProCard
        title="Visits (mock data)"
        bordered
        colSpan={{ xs: 24, lg: 16 }}
        style={{ borderRadius: 14 }}
      >
        <Area
          data={visits}
          xField="day"
          yField="visits"
          shapeField="smooth"
          height={260}
          style={{ fill: "linear-gradient(-90deg, white 0%, #2563eb 100%)" }}
          axis={{ x: { labelAutoHide: true } }}
        />
      </ProCard>
      <ProCard
        title="Posts by Topic"
        bordered
        colSpan={{ xs: 24, lg: 8 }}
        style={{ borderRadius: 14 }}
      >
        <Pie
          data={tagBreakdown}
          angleField="value"
          colorField="type"
          height={260}
          radius={0.85}
          innerRadius={0.55}
          legend={{ color: { position: "bottom" } }}
        />
      </ProCard>
    </ProCard>
  );
}
