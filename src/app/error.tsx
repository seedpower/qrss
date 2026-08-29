"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-ink/10 bg-white/80 px-8 py-12 text-center">
      <h1 className="font-serif text-2xl">出了点问题</h1>
      <p className="mt-3 text-sm text-ink/60">
        {error.message || "请确认 MongoDB 已启动，然后重试。"}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-ink px-4 py-2 text-sm text-cream"
      >
        重试
      </button>
    </div>
  );
}
