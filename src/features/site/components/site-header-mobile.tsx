"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { SiteBrand } from "@/shared/ui/site-brand";
import { LocaleSwitcher } from "./locale-switcher";
import type { HeaderNavItem } from "./site-header-bar";

type LabeledNavItem = HeaderNavItem & { label: string };

type HeaderTone = "light" | "ink";

type SiteHeaderMobileProps = {
  brand: string;
  menuLabel: string;
  items: LabeledNavItem[];
  tone?: HeaderTone;
};

const MENU_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function SiteHeaderMobile({
  brand,
  menuLabel,
  items,
  tone = "light",
}: SiteHeaderMobileProps) {
  return (
    <div className="flex h-28 items-center justify-between bg-white/[0.09] px-5 backdrop-blur-[8px] lg:hidden">
      <SiteBrand label={brand} mark="ink" />
      <div className="flex items-center gap-3">
        <LocaleSwitcher variant="dropdown" tone={tone} />
        <MobileMenu items={items} menuLabel={menuLabel} tone={tone} />
      </div>
    </div>
  );
}

function MobileMenu({
  items,
  menuLabel,
  tone,
}: {
  items: LabeledNavItem[];
  menuLabel: string;
  tone: HeaderTone;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="flex size-9 cursor-pointer items-center justify-center"
      >
        <BurgerIcon open={open} tone={tone} />
      </button>
      <nav
        id={menuId}
        aria-hidden={!open}
        className={cn(
          "absolute right-0 z-20 mt-3 w-56 origin-top-right rounded-2xl border border-white/10 bg-black p-3 shadow-lg",
          "transition-[opacity,transform,visibility] duration-400",
          MENU_EASE,
          "motion-reduce:transition-none",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none translate-y-1.5 scale-[0.96] opacity-0",
        )}
      >
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              key={item.key}
              className={cn(
                "transition-[opacity,transform] duration-400",
                MENU_EASE,
                "motion-reduce:transition-none",
                open
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0",
              )}
              style={{ transitionDelay: open ? `${60 + index * 28}ms` : "0ms" }}
            >
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                className="block rounded-full px-3 py-2 text-sm text-[var(--cream)] hover:bg-white/10"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function BurgerIcon({ open, tone }: { open: boolean; tone: HeaderTone }) {
  return (
    <span aria-hidden className="relative block h-3.5 w-5">
      <BurgerBar
        open={open}
        tone={tone}
        closedTransform="translate3d(0,-6px,0) rotate(0deg)"
        openTransform="translate3d(0,0,0) rotate(45deg)"
      />
      <BurgerBar
        open={open}
        tone={tone}
        closedTransform="translate3d(0,0,0) scaleX(1)"
        openTransform="translate3d(0,0,0) scaleX(0)"
        fade
      />
      <BurgerBar
        open={open}
        tone={tone}
        closedTransform="translate3d(0,6px,0) rotate(0deg)"
        openTransform="translate3d(0,0,0) rotate(-45deg)"
      />
    </span>
  );
}

function BurgerBar({
  open,
  tone,
  closedTransform,
  openTransform,
  fade = false,
}: {
  open: boolean;
  tone: HeaderTone;
  closedTransform: string;
  openTransform: string;
  fade?: boolean;
}) {
  return (
    <span
      className={cn(
        "absolute left-0 top-[calc(50%-1px)] block h-0.5 w-5 motion-reduce:!transition-none",
        tone === "ink" ? "bg-black" : "bg-white",
      )}
      style={{
        opacity: fade && open ? 0 : 1,
        transform: open ? openTransform : closedTransform,
        transition: fade
          ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease"
          : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    />
  );
}
