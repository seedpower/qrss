"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const links = [
  { href: "/", label: "全部" },
  { href: "/articles", label: "文章" },
  { href: "/videos", label: "视频" },
  { href: "/podcasts", label: "播客" },
  { href: "/starred", label: "收藏" },
  { href: "/feeds", label: "订阅" },
] as const;

type NavProps = {
  unread: number;
  starred: number;
  feeds: number;
};

export function Nav({ unread, starred, feeds }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");

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
          <Link href="/" className="shrink-0 tracking-tight">
            <span className="font-serif text-xl italic text-cream">Q</span>
            <span className="font-serif text-xl text-cream">RSS</span>
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
              placeholder="搜索标题…"
              className="w-32 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-cream outline-none placeholder:text-cream/40 focus:border-rust/70 lg:w-44"
            />
          </form>

          <button
            type="button"
            onClick={refreshAll}
            disabled={refreshing || pending}
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-cream/90 transition hover:bg-white/10 disabled:opacity-50"
          >
            {refreshing ? "刷新中…" : "刷新全部"}
          </button>
        </div>
      </div>
    </header>
  );
}
