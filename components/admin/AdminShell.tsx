"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ProLayout } from "@ant-design/pro-components";
import { Button, Dropdown, Tag, Avatar } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  EditOutlined,
  MailOutlined,
  GithubOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null; role?: string };
  children: React.ReactNode;
}

const route = {
  path: "/app",
  routes: [
    { path: "/app", name: "Dashboard", icon: <DashboardOutlined /> },
    { path: "/app/projects", name: "Projects", icon: <ProjectOutlined /> },
    { path: "/app/blog-admin", name: "Blog Admin", icon: <EditOutlined /> },
    { path: "/app/contact-inbox", name: "Contact Inbox", icon: <MailOutlined /> },
  ],
};

export function AdminShell({ user, children }: Props) {
  const pathname = usePathname() ?? "/app";
  const router = useRouter();

  return (
    <ProLayout
      title={siteData.name}
      logo={
        <span
          style={{
            display: "inline-block",
            width: 28,
            height: 28,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
          }}
        />
      }
      layout="mix"
      fixSiderbar
      fixedHeader
      route={route}
      location={{ pathname }}
      menuItemRender={(item, dom) => (
        <Link href={item.path ?? "/app"}>{dom}</Link>
      )}
      avatarProps={{
        src: user.image ?? undefined,
        icon: !user.image ? <UserOutlined /> : undefined,
        title: user.name ?? user.email ?? "User",
        size: "small",
        render: (_, dom) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: "role",
                  disabled: true,
                  label: (
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name ?? user.email}</div>
                      <div style={{ fontSize: 12 }}>
                        <Tag
                          color={user.role === "admin" ? "blue" : "default"}
                          style={{ textTransform: "capitalize" }}
                        >
                          {user.role ?? "viewer"}
                        </Tag>
                      </div>
                    </div>
                  ),
                },
                { type: "divider" },
                {
                  key: "site",
                  icon: <UserOutlined />,
                  label: "Public site",
                  onClick: () => router.push("/"),
                },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Sign out",
                  onClick: () => signOut({ callbackUrl: "/" }),
                },
              ],
            }}
          >
            {dom}
          </Dropdown>
        ),
      }}
      actionsRender={() => [
        <a
          key="repo"
          href={`https://github.com/${siteData.github}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: brandColors.textMuted }}
        >
          <GithubOutlined />
        </a>,
        <Button
          key="back"
          size="small"
          type="text"
          onClick={() => router.push("/")}
        >
          View public site
        </Button>,
      ]}
    >
      {children}
    </ProLayout>
  );
}
