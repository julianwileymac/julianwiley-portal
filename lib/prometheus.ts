import "server-only";

/**
 * Lightweight client for Prometheus' HTTP API. Used by /api/metrics/kpi to
 * surface live homelab-cluster numbers in the admin dashboard. Designed to
 * fail soft: if the configured `PROMETHEUS_URL` is unreachable or returns a
 * non-success response, callers receive `undefined` and the UI falls back
 * to the mock numbers it ships with.
 *
 * Configure via env:
 *   PROMETHEUS_URL=http://prometheus-operated.observability.svc.cluster.local:9090
 *
 * Leaving the env var empty disables live metrics entirely (useful for
 * local dev where the cluster isn't reachable).
 */

export interface PromInstantResult {
  metric: Record<string, string>;
  value: [number, string];
}

interface PromInstantResponse {
  status: "success" | "error";
  data?: { resultType: string; result: PromInstantResult[] };
  errorType?: string;
  error?: string;
}

const DEFAULT_TIMEOUT_MS = 4000;

function baseUrl(): string | undefined {
  const url = process.env.PROMETHEUS_URL;
  if (!url) return undefined;
  return url.replace(/\/$/, "");
}

export function isLiveMetricsConfigured(): boolean {
  return Boolean(baseUrl());
}

/**
 * Run an instant query against Prometheus. Returns `undefined` on any
 * network / HTTP / parse failure so callers can degrade gracefully.
 */
export async function promInstantQuery(
  query: string,
  signal?: AbortSignal,
): Promise<PromInstantResult[] | undefined> {
  const base = baseUrl();
  if (!base) return undefined;

  const url = `${base}/api/v1/query?query=${encodeURIComponent(query)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  signal?.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) return undefined;
    const body = (await res.json()) as PromInstantResponse;
    if (body.status !== "success" || !body.data) return undefined;
    return body.data.result;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

/** Convenience: extract a single scalar value from the first result row. */
export function firstScalar(
  result: PromInstantResult[] | undefined,
): number | undefined {
  if (!result || result.length === 0) return undefined;
  const first = result[0];
  if (!first) return undefined;
  const raw = first.value[1];
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Sum the value column across all result rows; returns `undefined` if there
 * were no rows or the input was undefined. Useful for `count by (...)` style
 * queries where you want a grand total.
 */
export function sumValues(
  result: PromInstantResult[] | undefined,
): number | undefined {
  if (!result || result.length === 0) return undefined;
  let total = 0;
  for (const row of result) {
    const n = Number(row.value[1]);
    if (Number.isFinite(n)) total += n;
  }
  return total;
}

export interface ClusterKpis {
  /** Total Running pods across the cluster. */
  runningPods?: number;
  /** Number of distinct namespaces in use. */
  namespaceCount?: number;
  /** Number of Ready nodes. */
  readyNodes?: number;
  /** Cluster CPU utilization, 0-1. */
  cpuUtilization?: number;
  /** Cluster memory utilization, 0-1. */
  memoryUtilization?: number;
  /** Whether the data was sourced from a live Prometheus or fell back to undefined. */
  source: "live" | "unconfigured" | "unreachable";
  fetchedAt: string;
}

/**
 * Materialize the dashboard's KPI tile values from a single round-trip of
 * Prometheus queries. Each query degrades to `undefined` independently so a
 * partial outage still surfaces the working KPIs.
 */
export async function fetchClusterKpis(): Promise<ClusterKpis> {
  const fetchedAt = new Date().toISOString();

  if (!isLiveMetricsConfigured()) {
    return { source: "unconfigured", fetchedAt };
  }

  const [pods, namespaces, nodes, cpu, mem] = await Promise.all([
    promInstantQuery('count(kube_pod_status_phase{phase="Running"})'),
    promInstantQuery("count(count by (namespace) (kube_namespace_labels))"),
    promInstantQuery('count(kube_node_status_condition{condition="Ready",status="true"})'),
    promInstantQuery(
      '1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))',
    ),
    promInstantQuery(
      "1 - sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes)",
    ),
  ]);

  // If every query failed, treat the whole call as unreachable so the UI can
  // surface a single "Prometheus unreachable" notice instead of five empty
  // tiles.
  const allUndefined =
    !pods && !namespaces && !nodes && !cpu && !mem;
  if (allUndefined) {
    return { source: "unreachable", fetchedAt };
  }

  return {
    runningPods: firstScalar(pods),
    namespaceCount: firstScalar(namespaces),
    readyNodes: firstScalar(nodes),
    cpuUtilization: firstScalar(cpu),
    memoryUtilization: firstScalar(mem),
    source: "live",
    fetchedAt,
  };
}
