"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { formatRelativeTime } from "@/lib/format";
import type { Item } from "@/lib/types";
import { GeminiSummaryLink } from "./GeminiSummaryLink";

export function VideoGrid({ items }: { items: Item[] }) {
  const router = useRouter();
  const { locale } = useLocale();

  function markRead(id: string, read: boolean) {
    if (read) return;
    void fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    }).then(() => router.refresh());
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <article key={item.id} className={item.read ? "opacity-75" : ""}>
          <Link
            href={`/items/${item.id}`}
            onClick={() => markRead(item.id, item.read)}
            className="block overflow-hidden rounded-xl bg-black/90"
          >
            <div className="relative aspect-video">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt=""
                  width={640}
                  height={360}
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index < 3 ? "high" : "low"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-ink/80" />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white">
                  ▶
                </span>
              </span>
              {!item.read && (
                <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-rust" />
              )}
            </div>
          </Link>
          <h2 className="mt-3 font-serif text-lg leading-snug text-ink">
            <Link
              href={`/items/${item.id}`}
              onClick={() => markRead(item.id, item.read)}
              className="hover:text-rust"
            >
              {item.title}
            </Link>
          </h2>
          <p className="mt-1 text-xs text-ink/50">
            <Link href={`/feeds/${item.feedId}`} className="hover:text-rust">
              {item.feedTitle}
            </Link>
            <span> · {formatRelativeTime(item.publishedAt, locale)}</span>
          </p>
          {item.videoId && (
            <div className="mt-2">
              <GeminiSummaryLink videoId={item.videoId} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
