"use client";

import { Button, Space } from "antd";
import { signIn } from "next-auth/react";
import { WindowsFilled } from "@ant-design/icons";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

interface Props {
  redirectTo?: string;
  /** Pass `false` to hide the Microsoft button (e.g. when AUTH_MICROSOFT_ENTRA_ID_* is unset). */
  microsoftEnabled?: boolean;
  /** Pass `false` to hide the Google button (e.g. when AUTH_GOOGLE_* is unset). */
  googleEnabled?: boolean;
}

export function ProviderButtons({
  redirectTo = "/app",
  microsoftEnabled = false,
  googleEnabled = false,
}: Props) {
  if (!microsoftEnabled && !googleEnabled) return null;

  return (
    <Space direction="vertical" size={10} style={{ width: "100%" }}>
      {googleEnabled && (
        <Button
          block
          size="large"
          icon={<GoogleIcon size={18} />}
          onClick={() => signIn("google", { callbackUrl: redirectTo })}
          style={{
            background: "#ffffff",
            color: "#1f1f1f",
            border: "1px solid #dadce0",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          Continue with Google
        </Button>
      )}
      {microsoftEnabled && (
        <Button
          block
          size="large"
          icon={<WindowsFilled />}
          onClick={() => signIn("microsoft-entra-id", { callbackUrl: redirectTo })}
          style={{
            background: "#2f2f2f",
            color: "#ffffff",
            border: "1px solid #2f2f2f",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          Continue with Microsoft
        </Button>
      )}
    </Space>
  );
}
