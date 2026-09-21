"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";

const labels: Record<AppLocale, string> = {
  hy: "ՀՅ",
  en: "EN",
  ru: "RU",
};

type LocaleSwitcherProps = {
  variant?: "inline" | "pill";
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

  if (variant === "pill") {
    const next = locales[(locales.indexOf(locale) + 1) % locales.length] ?? locale;
    return (
      <button
        type="button"
        className="flex h-[37px] w-[57px] shrink-0 items-center justify-center rounded-[20px] bg-white text-sm leading-[16.5px] tracking-[1.2px] text-black"
        onClick={() => selectLocale(next)}
      >
        {labels[locale]}
      </button>
    );
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
