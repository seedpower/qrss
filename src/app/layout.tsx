import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { LocaleProvider } from "@/components/LocaleProvider";
import { Nav } from "@/components/Nav";
import { localeToBcp47 } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/server";
import { navCounts } from "@/lib/queries";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return {
    title: t.meta.title,
    description: t.meta.description,
  };
}

export const dynamic = "force-dynamic";

async function NavWithCounts() {
  let counts = { unread: 0, starred: 0, feeds: 0 };
  try {
    counts = await navCounts();
  } catch {
    counts = { unread: 0, starred: 0, feeds: 0 };
  }
  return (
    <Nav unread={counts.unread} starred={counts.starred} feeds={counts.feeds} />
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale } = await getTranslator();

  return (
    <html
      lang={localeToBcp47(locale)}
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <LocaleProvider key={locale} initialLocale={locale}>
          <Suspense fallback={<Nav unread={0} starred={0} feeds={0} />}>
            <NavWithCounts />
          </Suspense>
          <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
            {children}
          </main>
        </LocaleProvider>
      </body>
    </html>
  );
}
