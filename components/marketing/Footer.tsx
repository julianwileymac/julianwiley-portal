"use client";

import Link from "next/link";
import { Layout, Space, Typography } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const iconMap = {
  github: <GithubOutlined />,
  linkedin: <LinkedinOutlined />,
  mail: <MailOutlined />,
  twitter: null,
  external: null,
};

export function Footer() {
  return (
    <AntFooter
      style={{
        textAlign: "center",
        background: brandColors.text,
        color: "#cbd5e1",
        padding: "48px 32px 32px",
      }}
    >
      <Space size={20} style={{ marginBottom: 16 }}>
        {siteData.social.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target={s.url.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={s.name}
            style={{ color: "#fff", fontSize: 22 }}
          >
            {iconMap[s.icon]}
          </a>
        ))}
      </Space>
      <div style={{ marginBottom: 8 }}>
        <Space size={16}>
          <Link href="/about" style={{ color: "#cbd5e1" }}>
            About
          </Link>
          <Link href="/projects" style={{ color: "#cbd5e1" }}>
            Projects
          </Link>
          <Link href="/blog" style={{ color: "#cbd5e1" }}>
            Blog
          </Link>
          <Link href="/contact" style={{ color: "#cbd5e1" }}>
            Contact
          </Link>
        </Space>
      </div>
      <Text style={{ color: "#94a3b8", fontSize: 13 }}>
        {siteData.copyright}
      </Text>
      <div style={{ marginTop: 4 }}>
        <Text style={{ color: "#64748b", fontSize: 12 }}>
          {siteData.disclaimer}
        </Text>
      </div>
    </AntFooter>
  );
}
