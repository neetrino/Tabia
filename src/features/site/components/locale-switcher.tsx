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

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center">
      {locales.map((item, index) => (
        <button
          key={item}
          type="button"
          className={cn(
            "px-2 py-1 text-xs font-semibold tracking-[1.2px]",
            index < locales.length - 1 && "border-r border-white/20",
            item === locale ? "text-[var(--cream)]" : "text-[var(--muted)] hover:text-[var(--cream)]",
          )}
          onClick={() => router.replace(pathname, { locale: item })}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
