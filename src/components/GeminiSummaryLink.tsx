import { geminiVideoSummaryUrl } from "@/lib/format";

export function GeminiSummaryLink({
  videoId,
  className = "inline-flex rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70 hover:border-rust/40 hover:text-rust",
}: {
  videoId: string;
  className?: string;
}) {
  return (
    <a
      href={geminiVideoSummaryUrl(videoId)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      视频总结
    </a>
  );
}
