"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { HOME_ASSETS } from "@/shared/config/content";
import { SiteBrand } from "@/shared/ui/site-brand";
import { cn } from "@/shared/lib/cn";
import { LocaleSwitcher } from "./locale-switcher";
import { SiteHeaderMobile } from "./site-header-mobile";

export type HeaderNavItem = {
  href: "/" | "/about" | "/services" | "/industries" | "/team" | "/news" | "/contact";
  key: "home" | "about" | "services" | "industries" | "team" | "news" | "contact";
};

type LabeledNavItem = HeaderNavItem & { label: string };

type SiteHeaderBarProps = {
  brand: string;
  contactLabel: string;
  menuLabel: string;
  items: LabeledNavItem[];
};

type PillRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function SiteHeaderBar({
  brand,
  contactLabel,
  menuLabel,
  items,
}: SiteHeaderBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 lg:top-4 lg:mt-4 lg:flex lg:justify-center lg:px-8">
      <SiteHeaderMobile brand={brand} menuLabel={menuLabel} items={items} />
      <div className="hidden h-20 w-full max-w-[1400px] items-center justify-between overflow-hidden rounded-full bg-black px-6 lg:flex lg:px-16">
        <SiteBrand label={brand} />
        <DesktopNav items={items} pathname={pathname} />
        <div className="flex items-center gap-6">
          <LocaleSwitcher />
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-base font-semibold leading-4 tracking-[0.3px] text-[var(--brand-cta)]"
          >
            {contactLabel}
          </Link>
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
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [pill, setPill] = useState<PillRect | null>(null);
  const [animate, setAnimate] = useState(false);
  const activeKey = items.find((item) => isActivePath(pathname, item.href))?.key;

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || !activeKey) {
      setPill(null);
      return;
    }

    const updatePill = () => {
      const activeEl = itemRefs.current.get(activeKey);
      if (!activeEl) {
        setPill(null);
        return;
      }

      const navBox = nav.getBoundingClientRect();
      const itemBox = activeEl.getBoundingClientRect();
      setPill({
        left: itemBox.left - navBox.left,
        top: itemBox.top - navBox.top,
        width: itemBox.width,
        height: itemBox.height,
      });
    };

    updatePill();
    const frame = window.requestAnimationFrame(() => setAnimate(true));

    const observer = new ResizeObserver(updatePill);
    observer.observe(nav);
    window.addEventListener("resize", updatePill);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updatePill);
    };
  }, [activeKey]);

  return (
    <nav ref={navRef} className="relative hidden items-center gap-5 lg:flex">
      {pill ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-0 top-0 rounded-full bg-white",
            animate &&
              "transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          )}
          style={{
            width: pill.width,
            height: pill.height,
            transform: `translate3d(${pill.left}px, ${pill.top}px, 0)`,
          }}
        />
      ) : null}
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Link
            key={item.key}
            href={item.href}
            ref={(node) => {
              if (node) {
                itemRefs.current.set(item.key, node);
              } else {
                itemRefs.current.delete(item.key);
              }
            }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative z-10 flex items-center gap-1 font-medium transition-colors duration-300",
              active
                ? "px-4 py-1.5 text-sm leading-5 text-[var(--ink)]"
                : "py-1.5 text-xs leading-4 tracking-[0.3px] text-[var(--nav)] hover:text-[var(--cream)]",
            )}
          >
            {item.key === "home" && active ? (
              <img
                src={HOME_ASSETS.navHome}
                alt=""
                width={14}
                height={14}
                className="block size-[14px] shrink-0"
              />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
