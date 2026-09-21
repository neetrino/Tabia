import { cookies } from "next/headers";
import {
  LOCALE_COOKIE_NAME,
  defaultLocale,
  locales,
  type AppLocale,
} from "./routing";

export function isAppLocale(
  value: string | undefined | null,
): value is AppLocale {
  return value !== undefined && value !== null && locales.includes(value as AppLocale);
}

export async function getLocaleFromCookie(): Promise<AppLocale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE_NAME)?.value;
  return isAppLocale(value) ? value : defaultLocale;
}
