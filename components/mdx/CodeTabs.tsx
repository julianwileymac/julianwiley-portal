"use client";

import { useState } from "react";
import { Tabs } from "antd";

interface CodeTabsProps {
  /** Optional: array of { label, language, code } */
  tabs?: { label: string; language?: string; code: string }[];
  children?: React.ReactNode;
}

/**
 * Approximate replacement for the Hugo `code-tabs` shortcode. Either pass
 * `tabs` explicitly, or wrap multiple <pre> children which will be split into
 * tabs by their `data-label` / `data-language` attributes.
 */
export function CodeTabs({ tabs, children }: CodeTabsProps) {
  const [active, setActive] = useState("0");
  if (tabs && tabs.length > 0) {
    return (
      <Tabs
        size="small"
        activeKey={active}
        onChange={setActive}
        items={tabs.map((t, i) => ({
          key: String(i),
          label: t.label,
          children: (
            <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 16, borderRadius: 10, overflow: "auto" }}>
              <code>{t.code}</code>
            </pre>
          ),
        }))}
      />
    );
  }
  return <div>{children}</div>;
}
