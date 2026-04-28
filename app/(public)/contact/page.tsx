"use client";

import { Card, Col, Row, Typography, message } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { GithubOutlined, LinkedinOutlined, MailOutlined } from "@ant-design/icons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

export default function ContactPage() {
  return (
    <div style={{ padding: "72px 32px", background: "#fff" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <Title level={1} style={{ fontWeight: 800, marginBottom: 8 }}>
          Get in Touch
        </Title>
        <Paragraph style={{ color: brandColors.textMuted, fontSize: 17, marginBottom: 32 }}>
          Open to AI/ML engineering, data platform, and quant infrastructure
          conversations. Best ways to reach me:
        </Paragraph>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={10}>
            <Card style={{ borderRadius: 12, height: "100%" }}>
              <Title level={4} style={{ marginTop: 0 }}>
                Direct Channels
              </Title>
              <ContactRow
                icon={<MailOutlined />}
                label="Email"
                value={siteData.email}
                href={`mailto:${siteData.email}`}
              />
              <ContactRow
                icon={<GithubOutlined />}
                label="GitHub"
                value={siteData.github}
                href={`https://github.com/${siteData.github}`}
              />
              <ContactRow
                icon={<LinkedinOutlined />}
                label="LinkedIn"
                value={`linkedin.com/in/${siteData.linkedin}`}
                href={`https://www.linkedin.com/in/${siteData.linkedin}/`}
              />
              <Paragraph style={{ color: brandColors.textMuted, fontSize: 13, marginTop: 24 }}>
                For longer-form async conversation, the form on the right ships
                straight to my inbox.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card style={{ borderRadius: 12 }}>
              <Title level={4} style={{ marginTop: 0 }}>
                Send a Message
              </Title>
              <ProForm
                onFinish={async (values) => {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  });
                  if (res.ok) {
                    message.success("Thanks — I'll be in touch soon.");
                    return true;
                  }
                  message.error("Something went wrong. Please try again or email me directly.");
                  return false;
                }}
                submitter={{
                  searchConfig: { submitText: "Send Message" },
                  resetButtonProps: false,
                  submitButtonProps: { size: "large", block: false },
                }}
              >
                <ProFormText
                  name="name"
                  label="Your Name"
                  placeholder="Jane Recruiter"
                  rules={[{ required: true, message: "Please tell me your name." }]}
                />
                <ProFormText
                  name="email"
                  label="Email"
                  placeholder="jane@company.com"
                  rules={[
                    { required: true, message: "Please share an email so I can reply." },
                    { type: "email", message: "Doesn't look like a valid email." },
                  ]}
                />
                <ProFormText
                  name="subject"
                  label="Subject"
                  placeholder="Quick intro / role at Company / collaboration idea"
                />
                <ProFormTextArea
                  name="message"
                  label="Message"
                  placeholder="A few sentences is plenty."
                  rules={[{ required: true, message: "Please add a message." }]}
                  fieldProps={{ rows: 6 }}
                />
              </ProForm>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${brandColors.border}`,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: brandColors.surfaceMuted,
          color: brandColors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <Text style={{ display: "block", fontSize: 12, color: brandColors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </Text>
        <Text strong>{value}</Text>
      </div>
    </a>
  );
}
