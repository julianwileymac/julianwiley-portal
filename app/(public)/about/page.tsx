import type { Metadata } from "next";
import { aboutData } from "@/lib/data/about";
import { AboutContent } from "@/components/marketing/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: aboutData.summary,
};

export default function AboutPage() {
  return <AboutContent />;
}
