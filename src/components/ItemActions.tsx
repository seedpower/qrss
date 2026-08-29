"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Item } from "@/lib/types";

export function ItemActions({ item }: { item: Item }) {
  const router = useRouter();
  const [starred, setStarred] = useState(item.starred);
  const [read, setRead] = useState(item.read);
  const [busy, setBusy] = useState(false);

  async function patch(next: { read?: boolean; starred?: boolean }) {
    setBusy(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) return;
      if (typeof next.starred === "boolean") setStarred(next.starred);
      if (typeof next.read === "boolean") setRead(next.read);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => patch({ starred: !starred })}
        className={`rounded-full border px-3 py-1 text-xs transition ${
          starred
            ? "border-rust/30 bg-rust/10 text-rust"
            : "border-ink/15 text-ink/70 hover:bg-ink/5"
        }`}
      >
        {starred ? "已收藏" : "收藏"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => patch({ read: !read })}
        className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70 hover:bg-ink/5"
      >
        {read ? "标为未读" : "标为已读"}
      </button>
    </div>
  );
}
