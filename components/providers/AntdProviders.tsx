"use client";

import { ConfigProvider, App as AntdApp } from "antd";
import { themeConfig } from "@/lib/theme";

export function AntdProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
