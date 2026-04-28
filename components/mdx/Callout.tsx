type CalloutType = "info" | "warning" | "tip" | "success" | "danger";

const styles: Record<
  CalloutType,
  { bg: string; border: string; color: string; icon: string; label: string }
> = {
  info: { bg: "rgba(37, 99, 235, 0.06)", border: "#2563eb", color: "#2563eb", icon: "ⓘ", label: "Info" },
  warning: { bg: "rgba(245, 158, 11, 0.08)", border: "#f59e0b", color: "#b45309", icon: "⚠", label: "Warning" },
  tip: { bg: "rgba(124, 58, 237, 0.06)", border: "#7c3aed", color: "#7c3aed", icon: "💡", label: "Tip" },
  success: { bg: "rgba(16, 185, 129, 0.08)", border: "#10b981", color: "#047857", icon: "✓", label: "Success" },
  danger: { bg: "rgba(239, 68, 68, 0.08)", border: "#ef4444", color: "#b91c1c", icon: "✕", label: "Danger" },
};

export function Callout({
  children,
  type = "info",
  title,
}: {
  children: React.ReactNode;
  type?: CalloutType;
  title?: string;
}) {
  const s = styles[type] ?? styles.info;
  return (
    <div
      style={{
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
        borderRadius: 8,
        padding: "14px 16px",
        margin: "16px 0",
      }}
    >
      <div
        style={{
          color: s.color,
          fontWeight: 700,
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span aria-hidden>{s.icon}</span> {title ?? s.label}
      </div>
      <div>{children}</div>
    </div>
  );
}
