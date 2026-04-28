import type { Metadata } from "next";
import { LoginCard } from "@/app/(auth)/login/LoginCard";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the julianwiley.com portal admin section.",
};

// Force per-request rendering. Without this Next.js statically prerenders
// the page at build time, when AUTH_* env vars are empty in the Docker
// build stage, and the resulting HTML permanently shows "no sign-in
// methods are configured".
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Read AUTH_* env vars at MODULE SCOPE (server startup) rather than per-
// request. Two reasons:
//   1. lib/auth.ts already does the same thing for provider registration;
//      keeping the gating logic on the same lifecycle avoids drift.
//   2. Per-request `process.env[name]` reads inside a server component
//      were returning `undefined` in the Next.js 15.5 standalone runtime
//      even with `dynamic = "force-dynamic"`. Module-scope reads fire
//      AFTER the container's env is populated (envFrom secretRef +
//      configMapRef), so they pick up the cluster Secret correctly.
const MICROSOFT_ENABLED = Boolean(
  process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
);
const GOOGLE_ENABLED = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);
const DEV_CREDENTIALS_ENABLED = process.env.NODE_ENV !== "production";

export default function LoginPage() {
  return (
    <LoginCard
      microsoftEnabled={MICROSOFT_ENABLED}
      googleEnabled={GOOGLE_ENABLED}
      devCredentialsEnabled={DEV_CREDENTIALS_ENABLED}
    />
  );
}
