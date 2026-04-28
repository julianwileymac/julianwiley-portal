import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { siteData } from "@/lib/data/site";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AntdProviders } from "@/components/providers/AntdProviders";

const mulish = Mulish({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mulish",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://julianwiley.com"
  ),
  title: {
    default: `${siteData.name} — ${siteData.tagline}`,
    template: `%s — ${siteData.name}`,
  },
  description: siteData.description,
  openGraph: {
    title: `${siteData.name} — ${siteData.tagline}`,
    description: siteData.description,
    url: "/",
    siteName: siteData.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteData.name} — ${siteData.tagline}`,
    description: siteData.description,
  },
  authors: [{ name: siteData.name }],
  creator: siteData.name,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mulish.variable}>
      <body
        style={{
          margin: 0,
          fontFamily:
            "var(--font-mulish), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <SessionProvider>
          <AntdRegistry>
            <AntdProviders>{children}</AntdProviders>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
