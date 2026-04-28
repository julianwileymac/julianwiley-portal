"use client";

import { Alert } from "antd";
import { PageContainer, ProCard } from "@/components/pro";
import { BlogAdminTable } from "@/components/admin/BlogAdminTable";
import type { PostMeta } from "@/lib/mdx";

interface Props {
  posts: (PostMeta & { editUrl: string })[];
}

export function BlogAdminContent({ posts }: Props) {
  return (
    <PageContainer
      header={{
        title: "Blog Admin",
        subTitle: "Inventory of MDX posts in this repo. Edits open on GitHub.",
      }}
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Read-only inventory."
        description="Phase 1 ships a list view with edit-on-GitHub deep links. A full WYSIWYG editor is out of scope for this phase."
      />
      <ProCard bordered>
        <BlogAdminTable posts={posts} />
      </ProCard>
    </PageContainer>
  );
}
