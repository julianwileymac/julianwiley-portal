"use client";

import { useEffect, useMemo, useRef } from "react";
import { Empty, Typography } from "antd";
import type { Project } from "@/lib/data/projects";
import { brandColors } from "@/lib/theme";

const { Text } = Typography;

interface Props {
  project: Project;
}

interface TopologyNode {
  id: string;
  type: "edge" | "tunnel" | "ingress" | "service" | "pod" | "external";
  label: string;
  sub?: string;
}

interface TopologyEdge {
  source: string;
  target: string;
  label?: string;
}

const colorByType: Record<TopologyNode["type"], { fill: string; stroke: string; text: string }> = {
  edge:     { fill: "#dbeafe", stroke: "#2563eb", text: "#1e3a8a" },
  tunnel:   { fill: "#ede9fe", stroke: "#7c3aed", text: "#4c1d95" },
  ingress:  { fill: "#dcfce7", stroke: "#10b981", text: "#064e3b" },
  service:  { fill: "#fef3c7", stroke: "#f59e0b", text: "#78350f" },
  pod:      { fill: "#fee2e2", stroke: "#ef4444", text: "#7f1d1d" },
  external: { fill: "#e2e8f0", stroke: "#475569", text: "#1e293b" },
};

/**
 * Build a Browser -> Cloudflare Tunnel -> Ingress -> Service -> Pod model
 * from a project's static deployments[]. We don't currently query the live
 * cluster (that would require ServiceAccount + RBAC); the topology shape is
 * derived from the configured URLs and known cluster patterns.
 */
function buildModel(project: Project): { nodes: TopologyNode[]; edges: TopologyEdge[] } {
  const deployments = project.deployments ?? [];
  if (deployments.length === 0) return { nodes: [], edges: [] };

  const nodes: TopologyNode[] = [
    { id: "browser", type: "external", label: "Browser", sub: "users" },
    { id: "tunnel", type: "tunnel", label: "Cloudflare Tunnel", sub: "cloudflared (edge ns)" },
    { id: "ingress", type: "ingress", label: "ingress-nginx", sub: "ingress namespace" },
  ];
  const edges: TopologyEdge[] = [
    { source: "browser", target: "tunnel", label: "HTTPS" },
    { source: "tunnel", target: "ingress", label: "QUIC" },
  ];

  for (const [i, d] of deployments.entries()) {
    let host: string | undefined;
    try {
      host = new URL(d.url).host;
    } catch {
      host = undefined;
    }
    const ns = d.namespace ?? "default";
    const svcId = `svc-${i}`;
    const podId = `pod-${i}`;

    nodes.push({
      id: svcId,
      type: "service",
      label: `Service: ${d.name}`,
      sub: host ? `${host} (${ns})` : ns,
    });
    nodes.push({
      id: podId,
      type: "pod",
      label: "Pod(s)",
      sub: d.internal ? "LAN-only" : "Public via tunnel",
    });

    edges.push({ source: "ingress", target: svcId, label: host ? `Host: ${host}` : undefined });
    edges.push({ source: svcId, target: podId });
  }

  // If a deployment is internal-only, prefix the LAN-only annotation on the
  // tunnel-to-ingress edge to make the constraint visible at a glance.
  const anyInternal = deployments.some((d) => d.internal);
  if (anyInternal) {
    nodes.push({
      id: "lan-note",
      type: "external",
      label: "LAN clients",
      sub: "skip the tunnel for *.local hosts",
    });
    edges.push({ source: "lan-note", target: "ingress", label: "LAN HTTP" });
  }

  return { nodes, edges };
}

export function ProjectTopology({ project }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<unknown>(null);

  const model = useMemo(() => buildModel(project), [project]);
  const isEmpty = model.nodes.length === 0;

  useEffect(() => {
    if (isEmpty || !containerRef.current) return;
    const container = containerRef.current;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { Graph } = await import("@antv/g6");
      if (cancelled || !container) return;

      const width = container.clientWidth || 800;
      const height = 380;

      const data = {
        nodes: model.nodes.map((n) => ({
          id: n.id,
          data: { kind: n.type },
          style: {
            x: 0,
            y: 0,
            labelText: n.label + (n.sub ? `\n${n.sub}` : ""),
            labelFill: colorByType[n.type].text,
            labelFontSize: 12,
            labelFontWeight: 600,
            labelTextAlign: "center" as const,
            labelTextBaseline: "middle" as const,
            labelPlacement: "center" as const,
            fill: colorByType[n.type].fill,
            stroke: colorByType[n.type].stroke,
            lineWidth: 1.5,
            radius: 10,
            size: [180, 56] as [number, number],
          },
          type: "rect",
        })),
        edges: model.edges.map((e, i) => ({
          id: `e${i}`,
          source: e.source,
          target: e.target,
          style: {
            stroke: brandColors.border,
            lineWidth: 1.5,
            endArrow: true,
            labelText: e.label ?? "",
            labelFill: brandColors.textMuted,
            labelFontSize: 11,
            labelBackgroundFill: "#ffffff",
            labelPadding: [2, 4],
          },
          type: "polyline",
        })),
      };

      const graph = new (Graph as unknown as new (cfg: Record<string, unknown>) => unknown)({
        container,
        width,
        height,
        autoFit: "view",
        padding: 20,
        node: { type: "rect" },
        edge: { type: "polyline" },
        layout: {
          type: "antv-dagre",
          rankdir: "LR",
          nodesep: 24,
          ranksep: 64,
        },
        behaviors: ["zoom-canvas", "drag-canvas"],
        data,
      });
      graphRef.current = graph;

      const g = graph as { render: () => Promise<void>; destroy: () => void };
      await g.render();

      const onResize = () => {
        const w = container.clientWidth || width;
        (graph as { setSize: (w: number, h: number) => void }).setSize(w, height);
      };
      window.addEventListener("resize", onResize);
      cleanup = () => {
        window.removeEventListener("resize", onResize);
        try {
          g.destroy();
        } catch {
          /* ignore */
        }
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [model, isEmpty]);

  if (isEmpty) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Text type="secondary" style={{ fontSize: 13 }}>
            No live deployments registered yet. Add entries under{" "}
            <code>deployments[]</code> in <code>lib/data/projects.ts</code> to
            render the request-flow topology here.
          </Text>
        }
      />
    );
  }

  return (
    <div>
      <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
        Request flow from public origin to the in-cluster Pods. Drag to pan,
        scroll to zoom.
      </Text>
      <div
        ref={containerRef}
        role="img"
        aria-label="Project topology diagram"
        style={{
          width: "100%",
          height: 380,
          background: "#ffffff",
          border: `1px solid ${brandColors.border}`,
          borderRadius: 10,
        }}
      />
    </div>
  );
}
