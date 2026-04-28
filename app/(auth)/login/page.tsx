"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { App, Card, Typography } from "antd";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { ProviderButtons } from "@/components/auth/ProviderButtons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Text, Paragraph } = Typography;

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/app";
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  return (
    <Card
      style={{
        maxWidth: 460,
        width: "100%",
        boxShadow: "0 20px 50px -20px rgba(15, 23, 42, 0.25)",
        borderRadius: 16,
        border: "none",
      }}
      styles={{ body: { padding: 36 } }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: brandColors.textMuted,
          fontSize: 13,
          marginBottom: 24,
          textDecoration: "none",
        }}
      >
        <ArrowLeftOutlined /> Back to site
      </Link>

      <ProviderButtons redirectTo={redirect} />

      <div style={{ marginTop: 24 }}>
        <LoginForm
          title={siteData.name}
          subTitle="Sign in to access your dashboard"
          submitter={{
            searchConfig: { submitText: "Sign In" },
            submitButtonProps: { loading, size: "large", block: true },
          }}
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
                return false;
              }
              message.success("Signed in.");
              router.push(redirect);
              router.refresh();
              return true;
            } finally {
              setLoading(false);
            }
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{ size: "large", prefix: <UserOutlined /> }}
            placeholder="Username"
            rules={[{ required: true, message: "Username is required" }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: "large", prefix: <LockOutlined /> }}
            placeholder="Password"
            rules={[{ required: true, message: "Password is required" }]}
          />
        </LoginForm>
        <Paragraph
          style={{
            marginTop: 8,
            color: brandColors.textMuted,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Dev login only. Real Entra ID and Google providers activate as soon as
          their <Text code>AUTH_*</Text> env vars are populated.
        </Paragraph>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
