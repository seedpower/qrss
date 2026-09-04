export const LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "qrss_locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "zh-CN";
}

export function localeToBcp47(locale: Locale): string {
  return locale === "zh-CN" ? "zh-CN" : "en";
}
