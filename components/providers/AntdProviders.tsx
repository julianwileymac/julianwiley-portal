"use client";

// Polyfill the legacy `ReactDOM.render` / `unmountComponentAtNode` APIs that
// React 19 dropped. Next.js 15.5 ships React 19 to the browser regardless of
// the React 18 pin in package.json, so antd's wave-effect renderer needs the
// patch to avoid the runtime warning + style flash.
import "@ant-design/v5-patch-for-react-19";

import { ConfigProvider, App as AntdApp } from "antd";
import { themeConfig } from "@/lib/theme";

export function AntdProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
