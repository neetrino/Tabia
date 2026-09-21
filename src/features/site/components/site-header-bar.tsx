"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { HOME_ASSETS } from "@/shared/config/content";
import { SiteBrand } from "@/shared/ui/site-brand";
import { cn } from "@/shared/lib/cn";
import { LocaleSwitcher } from "./locale-switcher";

export type HeaderNavItem = {
  href: "/" | "/about" | "/services" | "/industries" | "/team" | "/news" | "/insights" | "/contact";
  key: "home" | "about" | "services" | "industries" | "team" | "news" | "insights" | "contact";
};

type LabeledNavItem = HeaderNavItem & { label: string };

type SiteHeaderBarProps = {
  brand: string;
  contactLabel: string;
  menuLabel: string;
  items: LabeledNavItem[];
};

export function SiteHeaderBar({
  brand,
  contactLabel,
  menuLabel,
  items,
}: SiteHeaderBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 mt-4 flex justify-center px-4 md:px-8">
      <div className="flex h-16 w-full max-w-[1372px] items-center justify-between overflow-hidden rounded-full bg-black px-4 sm:h-20 sm:px-6 lg:px-16">
        <SiteBrand label={brand} className="origin-left scale-90 sm:scale-100" />
        <DesktopNav items={items} pathname={pathname} />
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <Link
            href="/contact"
            className="hidden h-12 items-center rounded-full bg-white px-6 text-base font-semibold tracking-[0.3px] text-[var(--brand)] lg:inline-flex"
          >
            {contactLabel}
          </Link>
          <MobileNav items={items} menuLabel={menuLabel} />
        </div>
      </div>
    </header>
  );
}

function DesktopNav({
  items,
  pathname,
}: {
  items: LabeledNavItem[];
  pathname: string;
}) {
  return (
    <nav className="hidden items-center gap-5 lg:flex">
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-1 text-xs font-medium tracking-[0.3px]",
              active
                ? "rounded-full bg-white px-4 py-1.5 text-sm text-[var(--ink)]"
                : "text-[var(--cream)] hover:text-[var(--cream)]/80",
            )}
          >
            {item.key === "home" && active ? (
              <img src={HOME_ASSETS.navHome} alt="" className="block" />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({
  items,
  menuLabel,
}: {
  items: LabeledNavItem[];
  menuLabel: string;
}) {
  return (
    <details className="relative lg:hidden">
      <summary className="cursor-pointer list-none rounded-full border border-white/20 px-3 py-2 text-sm text-[var(--cream)] [&::-webkit-details-marker]:hidden">
        {menuLabel}
      </summary>
      <nav className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-black p-3 shadow-lg">
        <div className="mb-3 border-b border-white/10 pb-3 md:hidden">
          <LocaleSwitcher />
        </div>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="block rounded-full px-3 py-2 text-sm text-[var(--cream)] hover:bg-white/10 hover:text-[var(--cream)]/80"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
