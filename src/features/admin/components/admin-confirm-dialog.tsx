"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

type AdminConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "brand";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const EXIT_MS = 280;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "danger",
  pending = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  const t = useTranslations("admin");
  const titleId = useId();
  const messageId = useId();
  const [present, setPresent] = useState(open);
  const resolvedTitle = title ?? t("confirm.title");
  const resolvedConfirm = confirmLabel ?? t("confirm.confirm");
  const resolvedCancel = cancelLabel ?? t("actions.cancel");
  const exiting = present && !open;

  if (open && !present) {
    setPresent(true);
  }

  if (!open && present && prefersReducedMotion()) {
    setPresent(false);
  }

  useEffect(() => {
    if (open || !present || prefersReducedMotion()) {
      return;
    }
    const timeout = window.setTimeout(() => setPresent(false), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open, present]);

  useEffect(() => {
    if (!present) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending && open) {
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [present, pending, open, onCancel]);

  if (!present) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <button
        type="button"
        aria-label={t("closeOverlay")}
        disabled={pending}
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm",
          exiting
            ? "animate-admin-modal-backdrop-out"
            : "animate-admin-modal-backdrop-in",
        )}
        onClick={() => {
          if (!pending && open) {
            onCancel();
          }
        }}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-[15px] border border-[var(--border)] bg-white p-6 shadow-2xl",
          exiting
            ? "animate-admin-modal-panel-out"
            : "animate-admin-modal-panel-in",
        )}
        onAnimationEnd={(event) => {
          if (
            event.target !== event.currentTarget ||
            open ||
            event.animationName !== "admin-modal-panel-out"
          ) {
            return;
          }
          setPresent(false);
        }}
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {resolvedTitle}
        </h2>
        <p id={messageId} className="mt-2 text-sm text-[var(--muted)]">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={pending}
            className={cn(
              "rounded-[15px] border border-[var(--border)] px-5 py-2.5 text-sm",
              "transition-transform duration-200 ease-out hover:scale-[1.02] hover:bg-[var(--surface)]",
              "motion-reduce:transition-none motion-reduce:hover:scale-100 disabled:opacity-60",
            )}
            onClick={onCancel}
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            disabled={pending}
            className={cn(
              "rounded-[15px] px-5 py-2.5 text-sm font-medium text-white",
              "transition-transform duration-200 ease-out hover:scale-[1.02]",
              "motion-reduce:transition-none motion-reduce:hover:scale-100 disabled:opacity-60",
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[var(--brand)] hover:bg-[var(--brand-deep)]",
            )}
            onClick={onConfirm}
          >
            {resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
