import { brandColors } from "@/lib/theme";

interface Props {
  items: string | string[];
}

export function TechStack({ items }: Props) {
  const list = Array.isArray(items) ? items : items.split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        margin: "12px 0",
        padding: "12px 16px",
        background: brandColors.surfaceMuted,
        borderRadius: 10,
      }}
    >
      <strong style={{ marginRight: 8, color: brandColors.text }}>Tech Stack:</strong>
      {list.map((item) => (
        <span
          key={item}
          style={{
            background: "#fff",
            border: `1px solid ${brandColors.border}`,
            borderRadius: 999,
            padding: "2px 12px",
            fontSize: 13,
            color: brandColors.primary,
            fontWeight: 600,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
