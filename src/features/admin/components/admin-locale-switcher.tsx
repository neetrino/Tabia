"use client";

import { useLayoutEffect, useRef, useState, useTransition } from "react";
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

type AdminLocaleSwitcherProps = {
  tone?: "light" | "dark";
};

type Indicator = {
  left: number;
  width: number;
  ready: boolean;
};

export function AdminLocaleSwitcher({
  tone = "light",
}: AdminLocaleSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
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
      aria-label={t("locale.label")}
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
            onClick={() => {
              if (item === locale) {
                return;
              }
              startTransition(async () => {
                await setAdminLocaleAction(item);
                router.refresh();
              });
            }}
          >
            {labels[item]}
          </button>
        );
      })}
    </div>
  );
}
