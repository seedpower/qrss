"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";
import { ItemList } from "./ItemList";
import { VideoGrid } from "./VideoGrid";

type LoadMoreProps = {
  initialItems: Item[];
  kind?: string;
  feedId?: string;
  starred?: boolean;
  q?: string;
  layout?: "list" | "grid";
};

export function FeedStream({
  initialItems,
  kind,
  feedId,
  starred,
  q,
  layout = "list",
}: LoadMoreProps) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initialItems.length < 30);

  async function loadMore() {
    const last = items[items.length - 1];
    if (!last) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        before: last.publishedAt,
        limit: "30",
      });
      if (kind) params.set("kind", kind);
      if (feedId) params.set("feedId", feedId);
      if (starred) params.set("starred", "1");
      if (q) params.set("q", q);
      const res = await fetch(`/api/items?${params}`);
      const data = (await res.json()) as { items?: Item[] };
      const next = data.items ?? [];
      if (next.length < 30) setDone(true);
      setItems((current) => {
        const seen = new Set(current.map((item) => item.id));
        return [...current, ...next.filter((item) => !seen.has(item.id))];
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {layout === "grid" ? <VideoGrid items={items} /> : <ItemList items={items} />}
      {!done && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-ink/15 px-5 py-2 text-sm text-ink/70 hover:bg-white disabled:opacity-50"
          >
            {loading ? "加载中…" : "加载更多"}
          </button>
        </div>
      )}
    </div>
  );
}
