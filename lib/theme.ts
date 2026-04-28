import type { ThemeConfig } from "antd";

export const brandColors = {
  primary: "#2563eb",
  accent: "#7c3aed",
  primaryDark: "#1d4ed8",
  surface: "#ffffff",
  surfaceMuted: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  textMuted: "#475569",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
} as const;

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: brandColors.primary,
    colorInfo: brandColors.primary,
    colorLink: brandColors.primary,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    borderRadius: 10,
    fontFamily:
      "var(--font-mulish), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 15,
  },
  components: {
    Button: {
      borderRadius: 10,
      controlHeight: 40,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 24,
    },
    Layout: {
      headerBg: "#ffffff",
      headerHeight: 72,
      bodyBg: "#f8fafc",
    },
    Menu: {
      itemSelectedBg: "rgba(37, 99, 235, 0.10)",
      itemSelectedColor: brandColors.primary,
      horizontalItemSelectedColor: brandColors.primary,
    },
  },
};
