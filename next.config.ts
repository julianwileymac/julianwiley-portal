import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "@ant-design/pro-components",
    "@ant-design/pro-layout",
    "@ant-design/pro-table",
    "@ant-design/pro-form",
    "@ant-design/pro-card",
    "@ant-design/pro-list",
    "@ant-design/pro-descriptions",
    "@ant-design/pro-utils",
    "@ant-design/pro-field",
    "@ant-design/pro-provider",
    "@ant-design/plots",
    "rc-util",
    "rc-pagination",
    "rc-picker",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default config;
