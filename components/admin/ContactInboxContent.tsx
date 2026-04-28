"use client";

import { Empty, Typography } from "antd";
import { PageContainer, ProCard } from "@/components/pro";

const { Paragraph } = Typography;

export function ContactInboxContent() {
  return (
    <PageContainer
      header={{
        title: "Contact Inbox",
        subTitle: "Messages submitted via the public /contact form.",
      }}
    >
      <ProCard bordered>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No persistent inbox in this phase.
              <br />
              <Paragraph type="secondary" style={{ marginTop: 8 }}>
                Phase 1 logs submissions to the server console (see <code>app/api/contact/route.ts</code>).
                Phase 3 will forward them to the FastAPI management backend in <code>rpi_kubernetes/management/</code> and surface them here.
              </Paragraph>
            </span>
          }
        />
      </ProCard>
    </PageContainer>
  );
}
