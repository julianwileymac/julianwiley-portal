"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Alert, App, Button, Card, Divider, Form, Input, Typography } from "antd";
import { ArrowLeftOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ProviderButtons } from "@/components/auth/ProviderButtons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Title, Text, Paragraph } = Typography;

interface Props {
  microsoftEnabled: boolean;
  googleEnabled: boolean;
  /** Whether to render the dev-credentials form. False in production. */
  devCredentialsEnabled: boolean;
}

/** Map NextAuth's `?error=` codes to friendly explanations. */
const ERROR_COPY: Record<string, { title: string; detail: string }> = {
  Configuration: {
    title: "Authentication is not configured.",
    detail: "AUTH_SECRET (and the OIDC client id/secret you tried) must be set in the server's environment. See the README for the .env.local + GCP Console checklist.",
  },
  AccessDenied: {
    title: "Access denied.",
    detail: "Your account is not on the allow-list for this portal.",
  },
  Verification: {
    title: "Sign-in link is no longer valid.",
    detail: "Try signing in again.",
  },
  OAuthSignin: {
    title: "Could not start the OAuth flow.",
    detail: "Confirm the OAuth client id/secret env vars are set, and that this origin is authorized in the provider's console.",
  },
  OAuthCallback: {
    title: "OAuth callback failed.",
    detail: "The provider rejected the callback. Most often this means the redirect URI is not authorized in the provider's console.",
  },
  OAuthAccountNotLinked: {
    title: "Account is linked to a different provider.",
    detail: "Sign in with the original provider you used the first time, then link the new one from your account settings.",
  },
  default: {
    title: "Sign-in failed.",
    detail: "An unknown error occurred. Try again, or check the server logs for details.",
  },
};

function LoginCardInner({ microsoftEnabled, googleEnabled, devCredentialsEnabled }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app";
  const errorCode = searchParams.get("error");
  const error = errorCode ? ERROR_COPY[errorCode] ?? ERROR_COPY.default : null;

  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<{ username: string; password: string }>();

  const showDivider = (microsoftEnabled || googleEnabled) && devCredentialsEnabled;
  const noProviders = !microsoftEnabled && !googleEnabled && !devCredentialsEnabled;

  return (
    <Card
      style={{
        maxWidth: 440,
        width: "100%",
        boxShadow: "0 20px 50px -20px rgba(15, 23, 42, 0.25)",
        borderRadius: 16,
        border: "none",
      }}
      styles={{ body: { padding: "32px 36px 36px" } }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: brandColors.textMuted,
          fontSize: 13,
          marginBottom: 20,
          textDecoration: "none",
        }}
      >
        <ArrowLeftOutlined /> Back to site
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span
          style={{
            display: "inline-block",
            width: 40,
            height: 40,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.accent} 100%)`,
            flexShrink: 0,
          }}
        />
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
            {siteData.name}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Sign in to access your dashboard
          </Text>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message={error.title}
          description={error.detail}
          style={{ marginBottom: 20 }}
        />
      )}

      {noProviders && (
        <Alert
          type="warning"
          showIcon
          message="No sign-in methods are configured."
          description="Set AUTH_SECRET plus at least one provider (Google, Entra, or dev credentials) in .env.local and restart the dev server."
          style={{ marginBottom: 20 }}
        />
      )}

      <ProviderButtons
        redirectTo={redirect}
        microsoftEnabled={microsoftEnabled}
        googleEnabled={googleEnabled}
      />

      {showDivider && (
        <Divider plain style={{ marginTop: 20, marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            OR
          </Text>
        </Divider>
      )}

      {devCredentialsEnabled && (
        <>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={async (values) => {
              setLoading(true);
              try {
                const res = await signIn("dev-credentials", {
                  username: values.username,
                  password: values.password,
                  redirect: false,
                });
                if (res?.error) {
                  message.error("Invalid credentials. Try julian / letmein in dev.");
                  return;
                }
                message.success("Signed in.");
                router.push(redirect);
                router.refresh();
              } finally {
                setLoading(false);
              }
            }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
              style={{ marginBottom: 12 }}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Username"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>
            <Button type="primary" size="large" htmlType="submit" block loading={loading}>
              Sign in with credentials
            </Button>
          </Form>
          <Paragraph
            style={{
              marginTop: 12,
              marginBottom: 0,
              color: brandColors.textMuted,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Dev login only (active when <Text code style={{ fontSize: 11 }}>NODE_ENV !== 'production'</Text>).
          </Paragraph>
        </>
      )}
    </Card>
  );
}

export function LoginCard(props: Props) {
  return (
    <Suspense fallback={null}>
      <LoginCardInner {...props} />
    </Suspense>
  );
}
