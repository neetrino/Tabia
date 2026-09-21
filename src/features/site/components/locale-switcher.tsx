"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";

const labels: Record<AppLocale, string> = {
  hy: "ՀՅ",
  en: "EN",
  ru: "RU",
};

const names: Record<AppLocale, string> = {
  hy: "Հայերեն",
  en: "English",
  ru: "Русский",
};

type LocaleSwitcherProps = {
  variant?: "inline" | "dropdown";
};

export function LocaleSwitcher({ variant = "inline" }: LocaleSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const selectLocale = (next: AppLocale) => {
    if (next === locale) {
      return;
    }
    router.replace(pathname, { locale: next });
  };

  if (variant === "dropdown") {
    return <LocaleDropdown locale={locale} onSelect={selectLocale} />;
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((item, index) => (
        <button
          key={item}
          type="button"
          className={cn(
            "px-2 py-1 text-xs font-semibold leading-4 tracking-[1.2px] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            index < locales.length - 1 && "border-r border-white/20",
            item === locale
              ? "text-[var(--cream)]"
              : "text-[var(--muted)] hover:text-[var(--cream)]",
          )}
          onClick={() => selectLocale(item)}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}

function LocaleDropdown({
  locale,
  onSelect,
}: {
  locale: AppLocale;
  onSelect: (next: AppLocale) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useCloseDetailsOnOutside(detailsRef);

  const choose = (next: AppLocale) => {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
    onSelect(next);
  };

  return (
    <details ref={detailsRef} className="group relative">
      <summary
        aria-label={names[locale]}
        className="flex h-[37px] cursor-pointer list-none items-center justify-center gap-1.5 rounded-[20px] bg-white px-3 text-sm leading-[16.5px] tracking-[1.2px] text-black [&::-webkit-details-marker]:hidden"
      >
        {labels[locale]}
        <LocaleChevron />
      </summary>
      <ul className="absolute right-0 z-20 mt-2 min-w-full overflow-hidden rounded-2xl bg-white py-1 text-sm tracking-[1.2px] text-black shadow-lg">
        {locales.map((item) => (
          <li key={item}>
            <button
              type="button"
              aria-label={names[item]}
              aria-current={item === locale ? "true" : undefined}
              className={cn(
                "block w-full px-3 py-2 text-center",
                item === locale ? "font-semibold" : "text-black/55",
              )}
              onClick={() => choose(item)}
            >
              {labels[item]}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

function LocaleChevron() {
  return (
    <span
      aria-hidden
      className="block h-1.5 w-1.5 translate-y-[-1px] rotate-45 border-b border-r border-current transition-transform group-open:translate-y-px group-open:rotate-[225deg]"
    />
  );
}

function useCloseDetailsOnOutside(detailsRef: RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) {
      return;
    }

    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!details.open || !(target instanceof Node) || details.contains(target)) {
        return;
      }
      details.open = false;
    };

    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [detailsRef]);
}
