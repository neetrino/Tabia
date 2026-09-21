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
      <div className="inline-flex rounded-md border border-[var(--border)] p-1">
        {locales.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded px-3 py-1 text-sm font-semibold",
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
