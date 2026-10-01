"use client";

import { useEffect, useLayoutEffect, useRef, useState, useTransition, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";
import { setAdminLocaleAction } from "../actions";

const labels: Record<AppLocale, string> = {
  hy: "ՀԱՅ",
  en: "EN",
  ru: "RU",
};

const names: Record<AppLocale, string> = {
  hy: "Հայերեն",
  en: "English",
  ru: "Русский",
};

type AdminLocaleSwitcherProps = {
  tone?: "light" | "dark";
  variant?: "segmented" | "dropdown";
};

type Indicator = {
  left: number;
  width: number;
  ready: boolean;
};

export function AdminLocaleSwitcher({
  tone = "light",
  variant = "segmented",
}: AdminLocaleSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function selectLocale(next: AppLocale): void {
    if (next === locale) {
      return;
    }
    startTransition(async () => {
      await setAdminLocaleAction(next);
      router.refresh();
    });
  }

  if (variant === "dropdown") {
    return (
      <AdminLocaleDropdown
        locale={locale}
        pending={pending}
        label={t("locale.label")}
        onSelect={selectLocale}
      />
    );
  }

  return (
    <AdminLocaleSegmented
      locale={locale}
      pending={pending}
      tone={tone}
      label={t("locale.label")}
      onSelect={selectLocale}
    />
  );
}

function AdminLocaleSegmented({
  locale,
  pending,
  tone,
  label,
  onSelect,
}: {
  locale: AppLocale;
  pending: boolean;
  tone: "light" | "dark";
  label: string;
  onSelect: (next: AppLocale) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<Indicator>({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeIndex = locales.indexOf(locale);

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
  }, [activeIndex, locale]);

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label={label}
      className={cn(
        "relative grid h-10 w-full grid-cols-3 gap-0.5 rounded-[15px] p-0.5",
        tone === "dark"
          ? "border border-white/15 bg-white/5"
          : "border border-[var(--border)] bg-[var(--surface)]",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0.5 bottom-0.5 rounded-[12px]",
          "transition-[left,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none",
          tone === "dark" ? "bg-white" : "bg-[var(--brand)]",
          indicator.ready ? "opacity-100" : "opacity-0",
        )}
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />
      {locales.map((item, index) => {
        const active = item === locale;

        return (
          <button
            key={item}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            type="button"
            disabled={pending}
            aria-pressed={active}
            className={cn(
              "relative z-10 flex h-full items-center justify-center rounded-[12px] px-2 text-sm font-semibold transition-colors duration-200",
              "motion-reduce:transition-none disabled:opacity-60",
              tone === "dark"
                ? active
                  ? "text-black"
                  : "text-white/55 hover:text-white"
                : active
                  ? "text-white"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]",
            )}
            onClick={() => onSelect(item)}
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}

function AdminLocaleDropdown({
  locale,
  pending,
  label,
  onSelect,
}: {
  locale: AppLocale;
  pending: boolean;
  label: string;
  onSelect: (next: AppLocale) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useCloseDetailsOnOutside(detailsRef);

  function choose(next: AppLocale): void {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
    onSelect(next);
  }

  return (
    <details ref={detailsRef} className="group relative shrink-0">
      <summary
        aria-label={label}
        className="flex h-8 cursor-pointer list-none items-center justify-center gap-1 rounded-full bg-[var(--brand)] px-2.5 text-xs font-semibold leading-4 tracking-[1px] text-[var(--cream)] [&::-webkit-details-marker]:hidden"
      >
        {labels[locale]}
        <LocaleChevron />
      </summary>
      <ul className="absolute right-0 z-20 mt-2 min-w-full overflow-hidden rounded-2xl bg-white py-1 text-xs tracking-[1px] text-black shadow-lg">
        {locales.map((item) => (
          <li key={item}>
            <button
              type="button"
              disabled={pending}
              aria-label={names[item]}
              aria-current={item === locale ? "true" : undefined}
              className={cn(
                "block w-full px-3 py-1.5 text-center disabled:opacity-60",
                item === locale ? "font-semibold text-[var(--brand)]" : "text-black/55",
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
