import { brandColors } from "@/lib/theme";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: `radial-gradient(ellipse at top left, rgba(37, 99, 235, 0.12) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(124, 58, 237, 0.14) 0%, transparent 55%), ${brandColors.surfaceMuted}`,
      }}
    >
      {children}
    </main>
  );
}
