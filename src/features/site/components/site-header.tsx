import { getTranslations } from "next-intl/server";
import { SiteHeaderBar, type HeaderNavItem } from "./site-header-bar";

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

  return (
    <SiteHeaderBar
      brand={t("brand")}
      contactLabel={t("actions.contactUs")}
      menuLabel={t("actions.menu")}
      items={navItems.map((item) => ({
        ...item,
        label: t(`nav.${item.key}`),
      }))}
    />
  );
}
