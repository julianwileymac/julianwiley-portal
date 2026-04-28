import { brandColors } from "@/lib/theme";

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(37, 99, 235, 0.06)",
        borderLeft: `4px solid ${brandColors.primary}`,
        borderRadius: 8,
        padding: "12px 16px",
        margin: "16px 0",
      }}
    >
      <strong style={{ color: brandColors.primary, marginRight: 8 }}>Note</strong>
      {children}
    </div>
  );
}
