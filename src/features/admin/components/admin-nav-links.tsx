"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

const links = [
  { href: "/admin", key: "dashboard" as const, exact: true },
  { href: "/admin/news", key: "news" as const },
  { href: "/admin/insights", key: "insights" as const },
  { href: "/admin/services", key: "services" as const },
  { href: "/admin/team", key: "team" as const },
];

type Indicator = {
  top: number;
  height: number;
  ready: boolean;
};

export function AdminNavLinks() {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState<Indicator>({
    top: 0,
    height: 0,
    ready: false,
  });

  const activeIndex = links.findIndex((link) =>
    link.exact
      ? pathname === link.href
      : pathname === link.href || pathname.startsWith(`${link.href}/`),
  );

  useLayoutEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    const nav = navRef.current;
    if (!activeItem || !nav || activeIndex < 0) {
      setIndicator((current) => ({ ...current, ready: false }));
      return;
    }

    setIndicator({
      top: activeItem.offsetTop,
      height: activeItem.offsetHeight,
      ready: true,
    });
  }, [activeIndex, pathname]);

  return (
    <nav ref={navRef} className="relative flex flex-1 flex-col gap-1 p-3">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-3 right-3 rounded-[15px] bg-[var(--brand)] shadow-sm",
          "transition-[top,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none",
          indicator.ready ? "opacity-100" : "opacity-0",
        )}
        style={{
          top: indicator.top,
          height: indicator.height,
        }}
      />
      {links.map((link, index) => {
        const active = index === activeIndex;

        return (
          <Link
            key={link.href}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            href={link.href}
            prefetch
            className={cn(
              "relative z-10 rounded-[15px] px-3 py-2.5 text-sm transition-colors duration-200 ease-out",
              "motion-reduce:transition-none",
              active
                ? "font-medium text-white"
                : "text-white/55 hover:bg-white/10 hover:text-white",
            )}
          >
            {t(`nav.${link.key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
