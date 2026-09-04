import {
  DEFAULT_LOCALE,
  localeToBcp47,
  type Locale,
} from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function formatRelativeTime(
  iso: string | Date,
  locale: Locale = DEFAULT_LOCALE,
) {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const diffMs = date.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const bcp47 = localeToBcp47(locale);
  const rtf = new Intl.RelativeTimeFormat(bcp47, { numeric: "auto" });
  const t = getMessages(locale);

  if (abs < minute) return t.time.justNow;
  if (abs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
  if (abs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  if (abs < 7 * day) return rtf.format(Math.round(diffMs / day), "day");

  return new Intl.DateTimeFormat(bcp47, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatAbsoluteTime(
  iso: string | Date,
  locale: Locale = DEFAULT_LOCALE,
) {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat(localeToBcp47(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function kindLabel(kind: string, locale: Locale = DEFAULT_LOCALE) {
  const t = getMessages(locale).kind;
  if (kind === "youtube") return t.youtube;
  if (kind === "podcast") return t.podcast;
  return t.article;
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function geminiVideoSummaryUrl(
  videoId: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const prompt =
    locale === "zh-CN"
      ? `使用文字讲述视频内容:${youtubeWatchUrl(videoId)}`
      : `Summarize this video in text:${youtubeWatchUrl(videoId)}`;
  return `https://gemini.google.com/app?input=${encodeURIComponent(prompt)}`;
}
