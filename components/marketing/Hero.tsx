"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Space, Typography } from "antd";
import { ArrowRightOutlined, DownloadOutlined } from "@ant-design/icons";
import { siteData } from "@/lib/data/site";
import { brandColors } from "@/lib/theme";

const { Title, Paragraph, Text } = Typography;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const current = siteData.summary[index] ?? "";
    const isDoneTyping = displayed === current;
    const isFullyDeleted = displayed === "";

    let delay = 70;
    if (phase === "pausing") delay = 1600;
    if (phase === "deleting") delay = 35;

    const t = setTimeout(() => {
      if (phase === "typing") {
        if (isDoneTyping) {
          setPhase("pausing");
        } else {
          setDisplayed(current.slice(0, displayed.length + 1));
        }
      } else if (phase === "pausing") {
        setPhase("deleting");
      } else if (phase === "deleting") {
        if (isFullyDeleted) {
          setIndex((i) => (i + 1) % siteData.summary.length);
          setPhase("typing");
        } else {
          setDisplayed(current.slice(0, displayed.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [displayed, index, phase]);

  return (
    <section
      style={{
        position: "relative",
        padding: "96px 32px 80px",
        background: `radial-gradient(ellipse at top left, rgba(37, 99, 235, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(124, 58, 237, 0.10) 0%, transparent 55%), #ffffff`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <Text
            style={{
              color: brandColors.primary,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontSize: 13,
            }}
          >
            {siteData.greeting}
          </Text>
          <Title
            level={1}
            style={{
              fontSize: "clamp(40px, 6vw, 68px)",
              lineHeight: 1.05,
              margin: "12px 0 8px",
              fontWeight: 800,
              letterSpacing: "-0.025em",
            }}
          >
            {siteData.name}
            <span
              style={{
                background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.accent} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              .
            </span>
          </Title>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              minHeight: 36,
              color: brandColors.textMuted,
              marginBottom: 24,
            }}
          >
            {displayed}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: "1em",
                background: brandColors.primary,
                marginLeft: 4,
                verticalAlign: "middle",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
          <Paragraph
            style={{
              fontSize: 17,
              color: brandColors.textMuted,
              maxWidth: 620,
              marginBottom: 32,
            }}
          >
            I build enterprise data platforms, MLOps systems, and quantitative
            research workflows. This portal hosts my projects, technical blog,
            and a control panel for the homelab Kubernetes cluster running it
            all.
          </Paragraph>
          <Space size={12} wrap>
            <Link href="/projects">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                View Projects
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="large">Read the Blog</Button>
            </Link>
            <a href={siteData.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button size="large" icon={<DownloadOutlined />}>
                Download Resume
              </Button>
            </a>
          </Space>
        </div>

        <div
          style={{
            position: "relative",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.accent} 100%)`,
            padding: 6,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              src={siteData.avatar}
              alt={siteData.name}
              width={240}
              height={240}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @media (max-width: 768px) {
          section > div { grid-template-columns: 1fr !important; text-align: center; }
        }
      `}</style>
    </section>
  );
}
