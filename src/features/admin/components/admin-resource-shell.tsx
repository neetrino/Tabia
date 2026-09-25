"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AdminDrawer } from "./admin-drawer";

type AdminResourceShellProps = {
  title: string;
  description: string;
  addLabel: string;
  children?: React.ReactNode;
  drawerTitle: string;
  drawerContent: React.ReactNode;
};

export function AdminResourceShell({
  title,
  description,
  addLabel,
  children,
  drawerTitle,
  drawerContent,
}: AdminResourceShellProps) {
  const t = useTranslations("admin");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-[15px] bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          + {addLabel}
        </button>
      </div>
      <div className="rounded-[15px] border border-[var(--border)] bg-white p-4 shadow-sm">
        {children ?? (
          <p className="text-sm text-[var(--muted)]">
            {t("empty", { addLabel })}
          </p>
        )}
      </div>
      <AdminDrawer
        open={open}
        title={drawerTitle}
        onClose={() => setOpen(false)}
      >
        {drawerContent}
      </AdminDrawer>
    </div>
  );
}
