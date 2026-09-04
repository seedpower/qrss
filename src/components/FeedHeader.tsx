"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { formatRelativeTime, kindLabel } from "@/lib/format";
import type { Feed } from "@/lib/types";

export function FeedHeader({ feed }: { feed: Feed }) {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    try {
      await fetch(`/api/feeds/${feed.id}/refresh`, { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function markRead() {
    setBusy(true);
    try {
      await fetch(`/api/feeds/${feed.id}/read`, { method: "POST" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink/40">
          {kindLabel(feed.kind, locale)}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">{feed.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">
          {feed.description || feed.url}
        </p>
        <p className="mt-2 text-xs text-ink/45">
          {t.feeds.itemsCount(feed.itemCount)}
          {feed.unreadCount > 0
            ? ` · ${t.feeds.unreadCount(feed.unreadCount)}`
            : ""}
          {feed.lastFetchedAt
            ? ` · ${t.feeds.updatedAt(formatRelativeTime(feed.lastFetchedAt, locale))}`
            : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={markRead}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:bg-white disabled:opacity-50"
        >
          {t.feedDetail.markAllRead}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={refresh}
          className="rounded-full bg-ink px-4 py-2 text-sm text-cream hover:bg-ink/90 disabled:opacity-50"
        >
          {busy ? t.feedDetail.pleaseWait : t.feedDetail.refresh}
        </button>
      </div>
    </header>
  );
}
