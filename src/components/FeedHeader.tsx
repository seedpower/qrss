"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatRelativeTime, kindLabel } from "@/lib/format";
import type { Feed } from "@/lib/types";

export function FeedHeader({ feed }: { feed: Feed }) {
  const router = useRouter();
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
          {kindLabel(feed.kind)}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">{feed.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">
          {feed.description || feed.url}
        </p>
        <p className="mt-2 text-xs text-ink/45">
          {feed.itemCount} 条
          {feed.unreadCount > 0 ? ` · ${feed.unreadCount} 未读` : ""}
          {feed.lastFetchedAt
            ? ` · 更新于 ${formatRelativeTime(feed.lastFetchedAt)}`
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
          全部已读
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={refresh}
          className="rounded-full bg-ink px-4 py-2 text-sm text-cream hover:bg-ink/90 disabled:opacity-50"
        >
          {busy ? "请稍候…" : "刷新"}
        </button>
      </div>
    </header>
  );
}
