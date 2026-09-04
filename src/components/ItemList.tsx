"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { formatRelativeTime, kindLabel } from "@/lib/format";
import type { Item } from "@/lib/types";
import { GeminiSummaryLink } from "./GeminiSummaryLink";
import { ItemActions } from "./ItemActions";

export function ItemRow({
  item,
  priority = false,
}: {
  item: Item;
  priority?: boolean;
}) {
  const router = useRouter();
  const { locale, t } = useLocale();

  function markRead() {
    if (item.read) return;
    void fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    }).then(() => router.refresh());
  }

  const href = `/items/${item.id}`;

  return (
    <article
      className={`group border-b border-ink/8 py-5 last:border-b-0 ${item.read ? "opacity-70" : ""}`}
    >
      <div className="flex gap-4">
        {item.thumbnail && (
          <Link href={href} onClick={markRead} className="shrink-0">
            <img
              src={item.thumbnail}
              alt=""
              width={160}
              height={96}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "low"}
              className="h-20 w-32 rounded-lg object-cover sm:h-24 sm:w-40"
            />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-ink/50">
            {!item.read && (
              <span className="h-1.5 w-1.5 rounded-full bg-rust" aria-hidden />
            )}
            <Link href={`/feeds/${item.feedId}`} className="hover:text-rust">
              {item.feedTitle}
            </Link>
            <span>·</span>
            <span>{kindLabel(item.kind, locale)}</span>
            <span>·</span>
            <time dateTime={item.publishedAt}>
              {formatRelativeTime(item.publishedAt, locale)}
            </time>
          </div>
          <h2 className="mt-1 font-serif text-xl leading-snug text-ink">
            <Link href={href} onClick={markRead} className="hover:text-rust">
              {item.title}
            </Link>
          </h2>
          {item.summary && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/65">
              {item.summary}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <ItemActions item={item} />
            <div className="flex items-center gap-2">
              {item.kind === "youtube" && item.videoId && (
                <GeminiSummaryLink videoId={item.videoId} />
              )}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-ink/45 hover:text-rust"
              >
                {t.item.original}
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ItemList({ items }: { items: Item[] }) {
  return (
    <div className="divide-y-0">
      {items.map((item, index) => (
        <ItemRow key={item.id} item={item} priority={index < 3} />
      ))}
    </div>
  );
}
