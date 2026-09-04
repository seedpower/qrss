import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  type Locale,
} from "./config";
import { getMessages, type Messages } from "./messages";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getTranslator(): Promise<{
  locale: Locale;
  t: Messages;
}> {
  const locale = await getLocale();
  return { locale, t: getMessages(locale) };
}
