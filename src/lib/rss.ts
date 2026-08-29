import Parser from "rss-parser";
import type { FeedKind } from "./types";
import { excerptFromHtml } from "./sanitize";

type ParsedItem = {
  title?: string;
  link?: string;
  guid?: string;
  id?: string;
  isoDate?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  author?: string;
  summary?: string;
  enclosure?: { url?: string; type?: string; length?: string };
  videoId?: string;
  channelId?: string;
  mediaGroup?: Record<string, unknown>;
  mediaThumbnail?: unknown;
  mediaContent?: unknown;
  itunesImage?: unknown;
  itunesDuration?: string;
  contentEncoded?: string;
};

type ParsedFeed = {
  title?: string;
  description?: string;
  link?: string;
  feedUrl?: string;
  image?: { url?: string; title?: string };
  itunes?: { image?: string; author?: string };
  itunesImage?: unknown;
  items: ParsedItem[];
};

const parser = new Parser({
  timeout: 15_000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; QRSS/1.0; +https://github.com/qrss) AppleWebKit/537.36",
    Accept:
      "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
  },
  customFields: {
    feed: [
      ["itunes:image", "itunesImage"],
      ["itunes:author", "itunesAuthor"],
    ],
    item: [
      ["yt:videoId", "videoId"],
      ["yt:channelId", "channelId"],
      ["media:group", "mediaGroup"],
      ["media:thumbnail", "mediaThumbnail"],
      ["media:content", "mediaContent"],
      ["itunes:image", "itunesImage"],
      ["itunes:duration", "itunesDuration"],
      ["content:encoded", "contentEncoded"],
    ],
  },
} as unknown as ConstructorParameters<typeof Parser>[0]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function attr(value: unknown, key: string): string | undefined {
  if (typeof value === "string" && value.startsWith("http")) return value;
  const rec = asRecord(value);
  if (!rec) return undefined;
  if (typeof rec[key] === "string") return rec[key] as string;
  const dollar = asRecord(rec.$);
  if (typeof dollar?.[key] === "string") return dollar[key] as string;
  if (typeof rec.url === "string") return rec.url;
  if (typeof rec.href === "string") return rec.href;
  return undefined;
}

function firstUrl(value: unknown): string | undefined {
  if (Array.isArray(value)) return firstUrl(value[0]);
  return attr(value, "url") ?? attr(value, "href");
}

function absolutize(maybeUrl: string | undefined, base: string) {
  if (!maybeUrl) return undefined;
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return maybeUrl;
  }
}

function pickThumbnail(item: ParsedItem, base: string): string | undefined {
  const group = asRecord(item.mediaGroup);
  const fromGroup = firstUrl(
    group?.["media:thumbnail"] ?? group?.thumbnail ?? group?.["media:content"],
  );
  const fromItunes = firstUrl(item.itunesImage);
  const fromMedia = firstUrl(item.mediaThumbnail) ?? firstUrl(item.mediaContent);
  const enclosureImage =
    item.enclosure?.type?.startsWith("image/") ? item.enclosure.url : undefined;
  const html = item.contentEncoded || item.content || "";
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
  return absolutize(
    fromItunes || fromMedia || fromGroup || enclosureImage || imgMatch,
    base,
  );
}

function pickContent(item: ParsedItem) {
  return (
    item.contentEncoded ||
    item.content ||
    item.summary ||
    item.contentSnippet ||
    ""
  );
}

function youtubeVideoId(item: ParsedItem) {
  if (item.videoId) return String(item.videoId);
  if (item.id?.startsWith("yt:video:")) return item.id.slice("yt:video:".length);
  const fromLink = item.link?.match(/[?&]v=([\w-]{6,})/)?.[1];
  if (fromLink) return fromLink;
  const fromGuid = item.guid?.match(/yt:video:([\w-]{6,})/)?.[1];
  return fromGuid ?? null;
}

function audioUrl(item: ParsedItem) {
  const type = item.enclosure?.type ?? "";
  if (item.enclosure?.url && (type.startsWith("audio/") || /\.(mp3|m4a|aac|ogg)(\?|$)/i.test(item.enclosure.url))) {
    return item.enclosure.url;
  }
  const group = asRecord(item.mediaGroup);
  const media = firstUrl(item.mediaContent) ?? firstUrl(group?.["media:content"]);
  if (media && /\.(mp3|m4a|aac|ogg)(\?|$)/i.test(media)) return media;
  return null;
}

function detectKind(feedUrl: string, items: ParsedItem[]): FeedKind {
  if (
    /youtube\.com\/feeds\/videos\.xml/i.test(feedUrl) ||
    items.some((item) => youtubeVideoId(item))
  ) {
    return "youtube";
  }
  if (items.some((item) => audioUrl(item))) return "podcast";
  return "article";
}

export type NormalizedItem = {
  guid: string;
  title: string;
  link: string;
  summary: string;
  content: string;
  author: string | null;
  publishedAt: Date;
  kind: FeedKind;
  thumbnail: string | null;
  videoId: string | null;
  audioUrl: string | null;
  duration: string | null;
};

export type NormalizedFeed = {
  url: string;
  title: string;
  description: string;
  siteUrl: string;
  imageUrl: string | null;
  kind: FeedKind;
  items: NormalizedItem[];
};

export async function fetchAndParseFeed(feedUrl: string): Promise<NormalizedFeed> {
  let parsed: ParsedFeed;
  try {
    parsed = (await parser.parseURL(feedUrl)) as ParsedFeed;
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    throw new Error(`无法解析 RSS：${message}`);
  }

  const siteUrl = parsed.link || feedUrl;
  const kind = detectKind(feedUrl, parsed.items ?? []);
  const feedImage =
    firstUrl(parsed.itunesImage) ||
    parsed.itunes?.image ||
    parsed.image?.url ||
    null;

  const items = (parsed.items ?? []).map((item, index) => {
    const content = pickContent(item);
    const videoId = kind === "youtube" ? youtubeVideoId(item) : null;
    const link =
      absolutize(item.link, siteUrl) ||
      (videoId ? `https://www.youtube.com/watch?v=${videoId}` : feedUrl);
    const guid =
      item.guid ||
      item.id ||
      videoId ||
      item.link ||
      `${feedUrl}#${index}`;

    return {
      guid: String(guid),
      title: (item.title || "无标题").trim(),
      link,
      summary: excerptFromHtml(item.contentSnippet || content),
      content,
      author: item.creator || item.author || null,
      publishedAt: item.isoDate
        ? new Date(item.isoDate)
        : item.pubDate
          ? new Date(item.pubDate)
          : new Date(),
      kind,
      thumbnail: pickThumbnail(item, siteUrl) ?? (videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : feedImage),
      videoId,
      audioUrl: audioUrl(item),
      duration: item.itunesDuration ?? null,
    } satisfies NormalizedItem;
  });

  return {
    url: feedUrl,
    title: (parsed.title || new URL(feedUrl).hostname).trim(),
    description: parsed.description || "",
    siteUrl,
    imageUrl: feedImage,
    kind,
    items,
  };
}
