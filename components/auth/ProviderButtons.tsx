"use client";

import { Button, Divider, Space, Typography } from "antd";
import { signIn } from "next-auth/react";
import { GoogleOutlined, WindowsOutlined } from "@ant-design/icons";
import { brandColors } from "@/lib/theme";

const { Text } = Typography;

interface Props {
  redirectTo?: string;
  /** Set to false in production once dummy IDs are replaced. */
  microsoftEnabled?: boolean;
  googleEnabled?: boolean;
}

export function ProviderButtons({
  redirectTo = "/app",
  microsoftEnabled = true,
  googleEnabled = true,
}: Props) {
  return (
    <div>
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {microsoftEnabled && (
          <Button
            block
            size="large"
            icon={<WindowsOutlined />}
            onClick={() =>
              signIn("microsoft-entra-id", { callbackUrl: redirectTo })
            }
          >
            Continue with Microsoft (Entra ID)
          </Button>
        )}
        {googleEnabled && (
          <Button
            block
            size="large"
            icon={<GoogleOutlined />}
            onClick={() => signIn("google", { callbackUrl: redirectTo })}
          >
            Continue with Google
          </Button>
        )}
      </Space>
      <Divider plain style={{ marginTop: 16, marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          OR
        </Text>
      </Divider>
      <Text style={{ display: "block", textAlign: "center", color: brandColors.textMuted, fontSize: 13 }}>
        Sign in with the dev credentials below (development only).
      </Text>
    </div>
  );
}
