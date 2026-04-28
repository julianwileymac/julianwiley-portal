import type { Metadata } from "next";
import { LoginCard } from "@/app/(auth)/login/LoginCard";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the julianwiley.com portal admin section.",
};

/**
 * Reads env on the server so we only render provider buttons whose OIDC
 * client id + secret are actually configured. This stops the "click button
 * -> ProviderNotFound" experience that happens when buttons are always
 * visible regardless of config.
 */
function isConfigured(...names: string[]): boolean {
  return names.every((n) => Boolean(process.env[n]));
}

export default function LoginPage() {
  const microsoftEnabled = isConfigured(
    "AUTH_MICROSOFT_ENTRA_ID_ID",
    "AUTH_MICROSOFT_ENTRA_ID_SECRET",
  );
  const googleEnabled = isConfigured("AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET");
  const devCredentialsEnabled = process.env.NODE_ENV !== "production";

  return (
    <LoginCard
      microsoftEnabled={microsoftEnabled}
      googleEnabled={googleEnabled}
      devCredentialsEnabled={devCredentialsEnabled}
    />
  );
}
