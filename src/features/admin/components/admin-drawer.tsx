"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

type AdminDrawerSize = "lg" | "xl" | "wide";

type AdminDrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: AdminDrawerSize;
};

const drawerWidthClassName: Record<AdminDrawerSize, string> = {
  lg: "w-full max-w-lg",
  xl: "w-full max-w-2xl",
  wide: "w-full md:w-[70%]",
};

export function AdminDrawer({
  open,
  title,
  onClose,
  children,
  size = "lg",
}: AdminDrawerProps) {
  const t = useTranslations("admin");

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label={t("closeOverlay")}
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <aside
        className={`relative z-10 flex h-full flex-col border-l border-[var(--border)] bg-white shadow-xl ${drawerWidthClassName[size]}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--surface)]"
          >
            {t("close")}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
