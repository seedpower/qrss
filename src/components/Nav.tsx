"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/components/LocaleProvider";

type NavProps = {
  unread: number;
  starred: number;
  feeds: number;
};

export function Nav({ unread, starred, feeds }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const [refreshing, setRefreshing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

  const links = [
    { href: "/", label: t.nav.all },
    { href: "/articles", label: t.nav.articles },
    { href: "/videos", label: t.nav.videos },
    { href: "/podcasts", label: t.nav.podcasts },
    { href: "/starred", label: t.nav.starred },
    { href: "/feeds", label: t.nav.feeds },
  ] as const;

  async function refreshAll() {
    setRefreshing(true);
    try {
      await fetch("/api/feeds/refresh", { method: "POST" });
      startTransition(() => router.refresh());
    } finally {
      setRefreshing(false);
    }
  }

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-cream backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 tracking-tight"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-7 w-7"
              aria-hidden
            >
              <path
                fill="#2563eb"
                fillRule="evenodd"
                d="M16 0a16 16 0 1 1 0 32A16 16 0 0 1 16 0Zm-6.2 7.2h7.1c4.05 0 6.7 2.25 6.7 5.65 0 2.4-1.3 4.2-3.55 5.1L25 24.8h-4.55l-4.9-6.5h-2.55v6.5H9.8V7.2Zm3.5 2.7v4.5h3.35c1.9 0 3.05-.9 3.05-2.25s-1.15-2.25-3.05-2.25H13.3Z"
              />
            </svg>
            <span className="font-serif text-xl text-cream">
              <span className="italic">Q</span>RSS
            </span>
          </Link>

          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              const count =
                link.href === "/"
                  ? unread
                  : link.href === "/starred"
                    ? starred
                    : link.href === "/feeds"
                      ? feeds
                      : 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition ${
                    active
                      ? "bg-cream text-ink"
                      : "text-cream/75 hover:bg-white/10 hover:text-cream"
                  }`}
                >
                  {link.label}
                  {count > 0 && (
                    <span
                      className={`ml-1.5 text-xs ${active ? "text-rust" : "text-cream/55"}`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={onSearch} className="hidden sm:block">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-32 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-cream outline-none placeholder:text-cream/40 focus:border-rust/70 lg:w-44"
            />
          </form>

          <LanguageSwitcher />

          <button
            type="button"
            onClick={refreshAll}
            disabled={refreshing || pending}
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-cream/90 transition hover:bg-white/10 disabled:opacity-50"
          >
            {refreshing ? t.nav.refreshing : t.nav.refreshAll}
          </button>
        </div>
      </div>
    </header>
  );
}
