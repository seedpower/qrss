import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemActions } from "@/components/ItemActions";
import { formatAbsoluteTime, kindLabel } from "@/lib/format";
import { getItem, updateItem } from "@/lib/queries";
import { sanitizeContent } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  if (!item.read) {
    try {
      await updateItem(id, { read: true });
    } catch {
      // ignore
    }
  }

  const html = sanitizeContent(item.content);

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs text-ink/45">
        <Link href={`/feeds/${item.feedId}`} className="hover:text-rust">
          {item.feedTitle}
        </Link>
        <span> · {kindLabel(item.kind)}</span>
        <span> · {formatAbsoluteTime(item.publishedAt)}</span>
        {item.author ? <span> · {item.author}</span> : null}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">{item.title}</h1>
      <div className="mt-5 flex items-center justify-between gap-3">
        <ItemActions item={{ ...item, read: true }} />
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-rust hover:underline"
        >
          打开原文
        </a>
      </div>

      {item.kind === "youtube" && item.videoId && (
        <div className="mt-8 overflow-hidden rounded-2xl bg-black shadow-sm">
          <iframe
            title={item.title}
            src={`https://www.youtube-nocookie.com/embed/${item.videoId}`}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {item.kind === "podcast" && item.audioUrl && (
        <div className="mt-8 rounded-2xl border border-ink/10 bg-white/80 p-4">
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt=""
              className="mb-4 h-40 w-40 rounded-xl object-cover"
            />
          )}
          <audio controls preload="none" className="w-full" src={item.audioUrl}>
            你的浏览器不支持音频播放。
          </audio>
        </div>
      )}

      {item.kind === "article" && item.thumbnail && !html.includes(item.thumbnail) && (
        <img
          src={item.thumbnail}
          alt=""
          className="mt-8 w-full rounded-2xl object-cover"
        />
      )}

      {html ? (
        <div className="prose-rss mt-8" dangerouslySetInnerHTML={{ __html: html }} />
      ) : item.summary ? (
        <p className="mt-8 text-lg leading-8 text-ink/70">{item.summary}</p>
      ) : null}
    </article>
  );
}
