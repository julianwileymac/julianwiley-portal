"use client";

import { useEffect, useRef, useState } from "react";

let mermaidPromise: Promise<typeof import("mermaid").default> | undefined;

async function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" });
      return m.default;
    });
  }
  return mermaidPromise;
}

export function Mermaid({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = await loadMermaid();
        const id = `m-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, children.trim());
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [children]);

  if (error) {
    return (
      <pre style={{ background: "#fef2f2", color: "#991b1b", padding: 12, borderRadius: 8 }}>
        Mermaid render error: {error}
      </pre>
    );
  }

  return <div ref={ref} style={{ display: "flex", justifyContent: "center", margin: "16px 0" }} />;
}
