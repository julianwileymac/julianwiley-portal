import type { Metadata } from "next";
import { LinksContent } from "@/components/marketing/LinksContent";

export const metadata: Metadata = {
  title: "Links",
  description: "External links — code, social, and writing.",
};

export default function LinksPage() {
  return <LinksContent />;
}
