"use client";

import { useLocale } from "@/components/LocaleProvider";
import { isLocale, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale, t, pending } = useLocale();

  return (
    <label className="relative shrink-0">
      <span className="sr-only">{t.nav.language}</span>
      <select
        value={locale}
        disabled={pending}
        aria-label={t.nav.language}
        onChange={(event) => {
          const next = event.target.value;
          if (isLocale(next)) setLocale(next as Locale);
        }}
        className="appearance-none rounded-full border border-white/15 bg-white/5 py-1.5 pl-3 pr-7 text-sm text-cream outline-none transition hover:bg-white/10 focus:border-rust/70 disabled:opacity-50"
      >
        <option value="en" className="bg-ink text-cream">
          {t.nav.langEn}
        </option>
        <option value="zh-CN" className="bg-ink text-cream">
          {t.nav.langZh}
        </option>
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] text-cream/55"
      >
        ▾
      </span>
    </label>
  );
}
