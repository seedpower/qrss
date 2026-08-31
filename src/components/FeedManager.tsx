"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { parseFeedCsv } from "@/lib/csv";
import { EXAMPLE_FEEDS } from "@/lib/examples";
import { formatRelativeTime, kindLabel } from "@/lib/format";
import type { Feed } from "@/lib/types";

type ImportProgress = {
  done: number;
  total: number;
  current: string;
};

export function FeedManager({ feeds }: { feeds: Feed[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(
    null,
  );

  async function subscribe(target = url) {
    if (!target.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "添加失败");
        return;
      }
      setUrl("");
      setNotice(null);
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setBusy(false);
    }
  }

  async function importCsv(file: File) {
    setError(null);
    setNotice(null);
    let rows;
    try {
      rows = parseFeedCsv(await file.text());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "CSV 解析失败");
      return;
    }
    if (rows.length === 0) {
      setError("CSV 里没有有效的订阅地址");
      return;
    }

    setBusy(true);
    setImportProgress({ done: 0, total: rows.length, current: rows[0].name || rows[0].url });
    let created = 0;
    let skipped = 0;
    const failures: string[] = [];

    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        setImportProgress({
          done: i,
          total: rows.length,
          current: row.name || row.url,
        });
        try {
          const res = await fetch("/api/feeds", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: row.url,
              title: row.name,
              skipIfExists: true,
            }),
          });
          const data = (await res.json()) as { created?: boolean; error?: string };
          if (!res.ok) {
            failures.push(`${row.name || row.url}：${data.error || "添加失败"}`);
          } else if (data.created) {
            created += 1;
          } else {
            skipped += 1;
          }
        } catch {
          failures.push(`${row.name || row.url}：网络错误`);
        }
      }

      const parts = [`新增 ${created}`, `已存在 ${skipped}`];
      if (failures.length > 0) parts.push(`失败 ${failures.length}`);
      setNotice(`导入完成：${parts.join("，")}`);
      if (failures.length > 0) {
        setError(failures.slice(0, 8).join("；"));
      }
      router.refresh();
    } finally {
      setBusy(false);
      setImportProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function refresh(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/feeds/${id}/refresh`, { method: "POST" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string, title: string) {
    if (!confirm(`取消订阅「${title}」？其中的条目也会被删除。`)) return;
    setBusyId(id);
    try {
      await fetch(`/api/feeds/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void subscribe();
        }}
        className="rounded-2xl border border-ink/10 bg-white/80 p-5 shadow-sm"
      >
        <label className="block font-serif text-xl text-ink">添加订阅</label>
        <p className="mt-1 text-sm text-ink/55">
          支持文章 RSS、Atom、播客 RSS，以及 YouTube 频道 / @handle / 播放列表链接。
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/feed.xml 或 https://www.youtube.com/@handle"
            className="min-w-0 flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none focus:border-rust"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-cream hover:bg-ink/90 disabled:opacity-50"
          >
            {busy ? (importProgress ? "导入中…" : "解析中…") : "订阅"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rust">{error}</p>}
        {notice && <p className="mt-3 text-sm text-ink/70">{notice}</p>}
        {importProgress && (
          <p className="mt-3 text-sm text-ink/55">
            导入中 {importProgress.done + 1}/{importProgress.total}
            {importProgress.current ? ` · ${importProgress.current}` : ""}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importCsv(file);
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-rust/40 hover:text-rust disabled:opacity-50"
          >
            导入 CSV
          </button>
          <a
            href="/api/feeds/export"
            className={`rounded-full border border-ink/15 px-4 py-2 text-sm hover:border-rust/40 hover:text-rust ${
              feeds.length === 0 ? "pointer-events-none opacity-50" : ""
            }`}
            aria-disabled={feeds.length === 0}
          >
            导出 CSV
          </a>
          <p className="text-xs text-ink/50">
            两列 <code className="text-ink/70">name,rss</code>
            ，导入时已订阅的会跳过。UTF-8 编码。
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_FEEDS.map((example) => (
            <button
              key={example.url}
              type="button"
              disabled={busy}
              onClick={() => {
                setUrl(example.url);
                void subscribe(example.url);
              }}
              className="rounded-full border border-ink/10 bg-paper px-3 py-1 text-xs text-ink/70 hover:border-rust/40 hover:text-rust"
            >
              {example.hint} · {example.title}
            </button>
          ))}
        </div>
      </form>

      <div className="space-y-3">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4 sm:flex-row sm:items-center"
          >
            {feed.imageUrl ? (
              <img
                src={feed.imageUrl}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-cream font-serif">
                {feed.title.slice(0, 1)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/feeds/${feed.id}`} className="font-medium hover:text-rust">
                {feed.title}
              </Link>
              <p className="mt-0.5 truncate text-xs text-ink/50">
                {kindLabel(feed.kind)} · {feed.itemCount} 条
                {feed.unreadCount > 0 ? ` · ${feed.unreadCount} 未读` : ""}
                {feed.lastFetchedAt
                  ? ` · 更新于 ${formatRelativeTime(feed.lastFetchedAt)}`
                  : ""}
              </p>
              {feed.lastError && (
                <p className="mt-1 text-xs text-rust">{feed.lastError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busyId === feed.id}
                onClick={() => refresh(feed.id)}
                className="rounded-full border border-ink/15 px-3 py-1 text-xs hover:bg-paper"
              >
                {busyId === feed.id ? "…" : "刷新"}
              </button>
              <button
                type="button"
                disabled={busyId === feed.id}
                onClick={() => remove(feed.id, feed.title)}
                className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/60 hover:border-rust/40 hover:text-rust"
              >
                取消
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
