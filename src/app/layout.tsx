import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Nav } from "@/components/Nav";
import { navCounts } from "@/lib/queries";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRSS · 订阅阅读",
  description: "用 Next.js 与 MongoDB 管理 RSS 文章、YouTube 视频与播客。",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  let counts = { unread: 0, starred: 0, feeds: 0 };
  try {
    counts = await navCounts();
  } catch {
    counts = { unread: 0, starred: 0, feeds: 0 };
  }

  return (
    <html lang="zh-CN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper text-ink">
        <Nav unread={counts.unread} starred={counts.starred} feeds={counts.feeds} />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
