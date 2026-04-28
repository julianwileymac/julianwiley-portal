import { brandColors } from "@/lib/theme";

export interface TocEntry {
  depth: number;
  value: string;
  id: string;
}

export function TocInline({ entries = [] }: { entries?: TocEntry[] }) {
  if (entries.length === 0) {
    return (
      <aside
        style={{
          background: brandColors.surfaceMuted,
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 13,
          color: brandColors.textMuted,
        }}
      >
        Table of contents will populate automatically.
      </aside>
    );
  }
  return (
    <nav
      aria-label="Table of contents"
      style={{
        background: brandColors.surfaceMuted,
        padding: "12px 16px",
        borderRadius: 10,
        margin: "16px 0",
      }}
    >
      <strong style={{ display: "block", marginBottom: 8 }}>On this page</strong>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {entries.map((e) => (
          <li
            key={e.id}
            style={{ paddingLeft: (e.depth - 1) * 12, marginBottom: 4, fontSize: 14 }}
          >
            <a href={`#${e.id}`} style={{ color: brandColors.primary, textDecoration: "none" }}>
              {e.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
