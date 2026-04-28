"use client";

import useSWR from "swr";
import { Alert, Skeleton, Tag, Tooltip } from "antd";
import { ProCard, StatisticCard } from "@/components/pro";
import {
  ProjectOutlined,
  EditOutlined,
  CloudServerOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  ApiOutlined,
  HddOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { brandColors } from "@/lib/theme";

interface ContentKpis {
  projectsCount: number;
  postsCount: number;
  servicesCount: number;
  lastUpdated: string;
}

interface ClusterKpis {
  source: "live" | "unconfigured" | "unreachable";
  fetchedAt: string;
  runningPods?: number;
  namespaceCount?: number;
  readyNodes?: number;
  cpuUtilization?: number;
  memoryUtilization?: number;
}

const fetcher = async (url: string): Promise<ClusterKpis> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`KPI fetch failed (${res.status})`);
  return (await res.json()) as ClusterKpis;
};

function fmtPct(v?: number): string {
  if (v === undefined || Number.isNaN(v)) return "—";
  return `${(v * 100).toFixed(1)}%`;
}

function fmtInt(v?: number): string {
  if (v === undefined || Number.isNaN(v)) return "—";
  return Math.round(v).toLocaleString();
}

export function KpiRow(props: ContentKpis) {
  const { data, error, isLoading } = useSWR<ClusterKpis>(
    "/api/metrics/kpi",
    fetcher,
    {
      refreshInterval: 30_000,
      revalidateOnFocus: true,
      keepPreviousData: true,
    },
  );

  const status = data?.source ?? (error ? "unreachable" : "unconfigured");
  const statusBadge = (() => {
    switch (status) {
      case "live":
        return <Tag color="green">Live</Tag>;
      case "unreachable":
        return <Tag color="red">Prometheus unreachable</Tag>;
      case "unconfigured":
      default:
        return <Tag color="default">Mock data — set PROMETHEUS_URL</Tag>;
    }
  })();

  return (
    <div>
      {/* Content KPIs (always live, derived from the file system at request time) */}
      <ProCard split="vertical" bordered headerBordered style={{ borderRadius: 14 }}>
        <StatisticCard
          statistic={{
            title: "Projects",
            value: props.projectsCount,
            icon: <ProjectOutlined style={{ color: brandColors.primary, fontSize: 24 }} />,
          }}
        />
        <StatisticCard
          statistic={{
            title: "Blog Posts",
            value: props.postsCount,
            icon: <EditOutlined style={{ color: brandColors.accent, fontSize: 24 }} />,
          }}
        />
        <StatisticCard
          statistic={{
            title: "Tracked Services",
            value: props.servicesCount,
            suffix: "deployments",
            icon: <CloudServerOutlined style={{ color: brandColors.success, fontSize: 24 }} />,
          }}
        />
        <StatisticCard
          statistic={{
            title: "Last Update",
            value: props.lastUpdated,
            icon: <ClockCircleOutlined style={{ color: brandColors.warning, fontSize: 24 }} />,
          }}
        />
      </ProCard>

      {/* Cluster KPIs — live from in-cluster Prometheus */}
      <ProCard
        title="Live Cluster Metrics"
        extra={
          <Tooltip
            title={
              data?.fetchedAt
                ? `Last fetched ${new Date(data.fetchedAt).toLocaleTimeString()}`
                : "Polling /api/metrics/kpi every 30 seconds."
            }
          >
            {statusBadge}
          </Tooltip>
        }
        bordered
        style={{ borderRadius: 14, marginTop: 16 }}
      >
        {status === "unconfigured" && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message="Live metrics are disabled in this environment."
            description={
              <span>
                Set <code>PROMETHEUS_URL</code> on the portal Deployment (e.g.{" "}
                <code>http://prometheus-operated.observability.svc.cluster.local:9090</code>)
                to surface live cluster KPIs here.
              </span>
            }
          />
        )}
        {status === "unreachable" && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            message="Prometheus is configured but did not respond."
            description="The portal pod could not reach PROMETHEUS_URL. Check the kube-prometheus-stack install and the in-cluster service name."
          />
        )}
        {isLoading && !data ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : (
          <ProCard split="vertical" ghost>
            <StatisticCard
              statistic={{
                title: "Running Pods",
                value: fmtInt(data?.runningPods),
                icon: <AppstoreOutlined style={{ color: brandColors.primary, fontSize: 24 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: "Namespaces",
                value: fmtInt(data?.namespaceCount),
                icon: <ApiOutlined style={{ color: brandColors.accent, fontSize: 24 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: "Ready Nodes",
                value: fmtInt(data?.readyNodes),
                icon: <HddOutlined style={{ color: brandColors.success, fontSize: 24 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: "CPU",
                value: fmtPct(data?.cpuUtilization),
                icon: <ThunderboltOutlined style={{ color: brandColors.warning, fontSize: 24 }} />,
              }}
            />
            <StatisticCard
              statistic={{
                title: "Memory",
                value: fmtPct(data?.memoryUtilization),
                icon: <DatabaseOutlined style={{ color: brandColors.error, fontSize: 24 }} />,
              }}
            />
          </ProCard>
        )}
      </ProCard>
    </div>
  );
}
