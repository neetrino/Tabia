"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";

const labels: Record<AppLocale, string> = {
  hy: "Հայերեն",
  en: "English",
  ru: "Русский",
};

type AdminContentLocaleSwitcherProps = {
  value: AppLocale;
  onChange: (locale: AppLocale) => void;
  label: string;
};

type Indicator = {
  left: number;
  width: number;
  ready: boolean;
};

export function AdminContentLocaleSwitcher({
  value,
  onChange,
  label,
}: AdminContentLocaleSwitcherProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<Indicator>({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeIndex = locales.indexOf(value);

  useLayoutEffect(() => {
    const activeItem = itemRefs.current[activeIndex];
    const track = trackRef.current;
    if (!activeItem || !track || activeIndex < 0) {
      setIndicator((current) => ({ ...current, ready: false }));
      return;
    }

    setIndicator({
      left: activeItem.offsetLeft,
      width: activeItem.offsetWidth,
      ready: true,
    });
  }, [activeIndex, value]);

  return (
    <div
      ref={trackRef}
      role="tablist"
      aria-label={label}
      className="relative flex gap-1 border-b border-[var(--border)]"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-[var(--brand)]",
          "transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none",
          indicator.ready ? "opacity-100" : "opacity-0",
        )}
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />
      {locales.map((item, index) => {
        const active = item === value;

        return (
          <button
            key={item}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              "relative px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none",
              active
                ? "text-[var(--brand)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]",
            )}
            onClick={() => onChange(item)}
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}
