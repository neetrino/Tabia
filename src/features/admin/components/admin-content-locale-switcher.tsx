"use client";

import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";

const labels: Record<AppLocale, string> = {
  hy: "HY",
  en: "EN",
  ru: "RU",
};

type AdminContentLocaleSwitcherProps = {
  value: AppLocale;
  onChange: (locale: AppLocale) => void;
  label: string;
};

export function AdminContentLocaleSwitcher({
  value,
  onChange,
  label,
}: AdminContentLocaleSwitcherProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="inline-flex rounded-[15px] border border-[var(--border)] p-1">
        {locales.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded-[15px] px-3 py-1 text-sm font-semibold transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100",
              item === value
                ? "bg-[var(--brand)] text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)]",
            )}
            onClick={() => onChange(item)}
          >
            {labels[item]}
          </button>
        ))}
      </div>
    </div>
  );
}
