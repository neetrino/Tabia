import { getLocale, getTranslations } from "next-intl/server";
import { getPublicationHref, getPublishedPublications } from "@/features/publications";
import { SiteHeaderBar, type HeaderNavItem } from "./site-header-bar";
import type { HeaderSearchItem } from "./header-search";

const navItems: HeaderNavItem[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/team", key: "team" },
  { href: "/news", key: "news" },
  { href: "/insights", key: "insights" },
  { href: "/contact", key: "contact" },
];

export async function SiteHeader() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const publications = await getPublishedPublications({ locale });
  const searchItems: HeaderSearchItem[] = publications.map((item) => ({
    title: item.title,
    href: getPublicationHref(item),
  }));

  return (
    <SiteHeaderBar
      brand={t("brand")}
      contactLabel={t("actions.contactUs")}
      menuLabel={t("actions.menu")}
      searchLabel={t("actions.search")}
      searchPlaceholder={t("actions.searchPlaceholder")}
      searchBackLabel={t("actions.back")}
      searchItems={searchItems}
      items={navItems.map((item) => ({
        ...item,
        label: t(`nav.${item.key}`),
      }))}
    />
  );
}
