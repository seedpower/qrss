const rtf = new Intl.RelativeTimeFormat("zh-CN", { numeric: "auto" });

export function formatRelativeTime(iso: string | Date) {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  const diffMs = date.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs < minute) return "刚刚";
  if (abs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
  if (abs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  if (abs < 7 * day) return rtf.format(Math.round(diffMs / day), "day");

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatAbsoluteTime(iso: string | Date) {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function kindLabel(kind: string) {
  if (kind === "youtube") return "视频";
  if (kind === "podcast") return "播客";
  return "文章";
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function geminiVideoSummaryUrl(videoId: string) {
  return `https://gemini.google.com/app?input=使用文字讲述视频内容:${youtubeWatchUrl(videoId)}`;
}
