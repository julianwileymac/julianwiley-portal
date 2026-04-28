import { brandColors } from "@/lib/theme";

interface Props {
  name?: string;
  children: React.ReactNode;
}

export function ProjectShowcase({ name, children }: Props) {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(124, 58, 237, 0.05))`,
        border: `1px solid ${brandColors.border}`,
        borderRadius: 12,
        padding: 24,
        margin: "20px 0",
      }}
    >
      {name && (
        <header style={{ marginBottom: 12 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              color: brandColors.primary,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            Project Showcase
          </span>
          <h3 style={{ margin: 0, color: brandColors.text }}>{name}</h3>
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
