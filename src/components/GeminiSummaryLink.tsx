"use client";

import { useLocale } from "@/components/LocaleProvider";
import { geminiVideoSummaryUrl } from "@/lib/format";

export function GeminiSummaryLink({
  videoId,
  className = "inline-flex rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70 hover:border-rust/40 hover:text-rust",
}: {
  videoId: string;
  className?: string;
}) {
  const { locale, t } = useLocale();
  return (
    <a
      href={geminiVideoSummaryUrl(videoId, locale)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {t.item.videoSummary}
    </a>
  );
}
