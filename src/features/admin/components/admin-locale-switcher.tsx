"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales, type AppLocale } from "@/i18n/routing";
import { setAdminLocaleAction } from "../actions";

const labels: Record<AppLocale, string> = {
  hy: "ՀԱՅ",
  en: "EN",
  ru: "RU",
};

export function AdminLocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("admin");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center gap-1 text-sm"
      aria-label={t("locale.label")}
    >
      {locales.map((item) => (
        <button
          key={item}
          type="button"
          disabled={pending}
          className={
            item === locale
              ? "rounded px-2 py-1 font-semibold text-[var(--brand)]"
              : "rounded px-2 py-1 text-[var(--muted)] hover:text-[var(--foreground)]"
          }
          onClick={() => {
            startTransition(async () => {
              await setAdminLocaleAction(item);
              router.refresh();
            });
          }}
        >
          {labels[item]}
        </button>
      ))}
    </div>
  );
}
