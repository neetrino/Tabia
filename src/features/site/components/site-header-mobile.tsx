"use client";

import { Link } from "@/i18n/navigation";
import { SiteBrand } from "@/shared/ui/site-brand";
import { LocaleSwitcher } from "./locale-switcher";
import type { HeaderNavItem } from "./site-header-bar";

type LabeledNavItem = HeaderNavItem & { label: string };

type SiteHeaderMobileProps = {
  brand: string;
  menuLabel: string;
  items: LabeledNavItem[];
};

export function SiteHeaderMobile({ brand, menuLabel, items }: SiteHeaderMobileProps) {
  return (
    <div className="flex h-28 items-center justify-between bg-white/[0.09] px-5 backdrop-blur-[8px] lg:hidden">
      <SiteBrand label={brand} mark="ink" />
      <div className="flex items-center gap-3">
        <LocaleSwitcher variant="pill" />
        <MobileMenu items={items} menuLabel={menuLabel} />
      </div>
    </div>
  );
}

function MobileMenu({
  items,
  menuLabel,
}: {
  items: LabeledNavItem[];
  menuLabel: string;
}) {
  return (
    <details className="relative">
      <summary
        aria-label={menuLabel}
        className="flex cursor-pointer list-none flex-col gap-[5px] p-2 [&::-webkit-details-marker]:hidden"
      >
        <MenuBar />
        <MenuBar />
        <MenuBar />
      </summary>
      <nav className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-black p-3 shadow-lg">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="block rounded-full px-3 py-2 text-sm text-[var(--cream)] hover:bg-white/10"
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

function MenuBar() {
  return <span aria-hidden className="block h-0.5 w-5 bg-black" />;
}
