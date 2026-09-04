"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale, t, pending } = useLocale();

  function select(next: Locale) {
    setLocale(next);
  }

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-white/15 p-0.5 text-xs"
      role="group"
      aria-label={t.nav.language}
    >
      <button
        type="button"
        disabled={pending}
        aria-pressed={locale === "en"}
        onClick={() => select("en")}
        className={`rounded-full px-2.5 py-1 transition disabled:opacity-50 ${
          locale === "en"
            ? "bg-cream text-ink"
            : "text-cream/70 hover:text-cream"
        }`}
      >
        {t.nav.langEn}
      </button>
      <button
        type="button"
        disabled={pending}
        aria-pressed={locale === "zh-CN"}
        onClick={() => select("zh-CN")}
        className={`rounded-full px-2.5 py-1 transition disabled:opacity-50 ${
          locale === "zh-CN"
            ? "bg-cream text-ink"
            : "text-cream/70 hover:text-cream"
        }`}
      >
        {t.nav.langZh}
      </button>
    </div>
  );
}
