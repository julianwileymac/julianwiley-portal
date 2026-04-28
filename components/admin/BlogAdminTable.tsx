"use client";

import Link from "next/link";
import { ProTable } from "@ant-design/pro-components";
import { Button, Space, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import type { PostMeta } from "@/lib/mdx";

interface PostRow extends PostMeta {
  editUrl: string;
}

interface Props {
  posts: PostRow[];
}

export function BlogAdminTable({ posts }: Props) {
  const columns: ProColumns<PostRow>[] = [
    {
      title: "Title",
      dataIndex: "title",
      ellipsis: true,
      render: (_, record) => <Link href={`/blog/${record.slug}`}>{record.title}</Link>,
    },
    {
      title: "Date",
      dataIndex: "isoDate",
      width: 120,
      sorter: (a, b) => (a.isoDate < b.isoDate ? 1 : -1),
      defaultSortOrder: "ascend",
      render: (_, r) =>
        new Date(r.isoDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      width: 240,
      render: (_, r) => (
        <Space size={[4, 4]} wrap>
          {r.tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </Space>
      ),
      filters: Array.from(new Set(posts.flatMap((p) => p.tags)))
        .sort()
        .map((t) => ({ text: t, value: t })),
      onFilter: (value, record) => record.tags.includes(value as string),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Actions",
      width: 200,
      render: (_, r) => (
        <Space>
          <Link href={`/blog/${r.slug}`}>
            <Button size="small" icon={<EyeOutlined />}>
              View
            </Button>
          </Link>
          <a href={r.editUrl} target="_blank" rel="noopener noreferrer">
            <Button size="small" type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<PostRow>
      rowKey="slug"
      dataSource={posts}
      columns={columns}
      search={{ filterType: "light" }}
      pagination={{ pageSize: 20, showSizeChanger: true }}
      options={{ density: true, fullScreen: true, reload: false, setting: true }}
      toolbar={{ title: `${posts.length} posts` }}
    />
  );
}
