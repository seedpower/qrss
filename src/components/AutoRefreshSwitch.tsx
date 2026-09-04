"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export function AutoRefreshSwitch({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const { t } = useLocale();
  const [on, setOn] = useState(enabled);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !on;
    setOn(next);
    setBusy(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoRefresh: next }),
      });
      if (!res.ok) {
        setOn(!next);
        return;
      }
      router.refresh();
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={() => void toggle()}
      className="flex items-center gap-3 rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-left disabled:opacity-50"
    >
      <span className="min-w-0">
        <span className="block text-sm text-ink">{t.feeds.autoRefresh}</span>
        <span className="block text-xs text-ink/50">{t.feeds.autoRefreshHint}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          on ? "bg-rust" : "bg-ink/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            on ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
