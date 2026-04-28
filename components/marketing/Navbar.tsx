"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Layout, Menu } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Header } = Layout;

const navItems = [
  { key: "/", label: "Home", href: "/" },
  { key: "/projects", label: "Projects", href: "/projects" },
  { key: "/blog", label: "Blog", href: "/blog" },
  { key: "/docs", label: "Docs", href: "/docs" },
  { key: "/notes", label: "Notes", href: "/notes" },
  { key: "/about", label: "About", href: "/about" },
  { key: "/links", label: "Links", href: "/links" },
  { key: "/contact", label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const selectedKey = navItems
    .map((i) => i.key)
    .sort((a, b) => b.length - a.length)
    .find((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k))) ?? "/";

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 32px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "saturate(180%) blur(8px)",
        borderBottom: `1px solid ${brandColors.border}`,
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 800,
          fontSize: 18,
          color: brandColors.text,
          textDecoration: "none",
          letterSpacing: "-0.01em",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.accent} 100%)`,
          }}
        />
        {siteData.name}
      </Link>

      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{
          flex: 1,
          minWidth: 0,
          borderBottom: "none",
          background: "transparent",
        }}
        items={navItems.map((item) => ({
          key: item.key,
          label: <Link href={item.href}>{item.label}</Link>,
        }))}
      />

      <Link href="/login">
        <Button type="primary" icon={<LoginOutlined />}>
          Sign in
        </Button>
      </Link>
    </Header>
  );
}
