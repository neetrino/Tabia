import { getRequestConfig } from "next-intl/server";
import { getLocaleFromCookie, isAppLocale } from "./locale";
import type { AppLocale } from "./routing";

const pageNamespaces = [
  "common",
  "home",
  "about",
  "team",
  "services",
  "news",
  "insights",
  "contact",
  "admin",
] as const;

async function loadMessages(locale: AppLocale) {
  const entries = await Promise.all(
    pageNamespaces.map(async (namespace) => {
      const messages = (
        await import(`../../locales/${locale}/${namespace}.json`)
      ).default;
      return [namespace, messages] as const;
    }),
  );

  return Object.fromEntries(entries);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: AppLocale = isAppLocale(requested)
    ? requested
    : await getLocaleFromCookie();

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
