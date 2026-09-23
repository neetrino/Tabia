"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

type AdminDrawerSize = "lg" | "xl" | "wide";

type AdminDrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: AdminDrawerSize;
};

const drawerWidthClassName: Record<AdminDrawerSize, string> = {
  lg: "w-[87%] max-w-lg sm:w-full",
  xl: "w-[87%] max-w-2xl sm:w-full",
  wide: "w-[87%] max-w-3xl md:w-[55%] md:max-w-4xl",
};

const AdminDrawerHeaderActionsContext = createContext<
  ((node: ReactNode) => void) | null
>(null);

/** Places children in the open sheet header, next to the close button. */
export function AdminDrawerHeaderActions({
  children,
}: {
  children: ReactNode;
}): null {
  const setHeaderActions = useContext(AdminDrawerHeaderActionsContext);

  useLayoutEffect(() => {
    if (!setHeaderActions) {
      return;
    }
    setHeaderActions(children);
    return () => setHeaderActions(null);
  }, [children, setHeaderActions]);

  return null;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AdminDrawer({
  open,
  title,
  onClose,
  children,
  size = "lg",
}: AdminDrawerProps) {
  const t = useTranslations("admin");
  const titleId = useId();
  const [present, setPresent] = useState(open);
  const [headerActions, setHeaderActions] = useState<ReactNode>(null);

  if (open && !present) {
    setPresent(true);
  }

  if (!open && present && prefersReducedMotion()) {
    setPresent(false);
  }

  useEffect(() => {
    if (open || !present) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPresent(false);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [open, present]);

  useEffect(() => {
    if (!present) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [present, onClose]);

  if (!present) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label={t("closeOverlay")}
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ease-out",
          "starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:opacity-100",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex h-dvh max-h-dvh flex-col overflow-hidden bg-white shadow-2xl",
          "rounded-tl-[15px] rounded-bl-[15px]",
          "transition-[translate] duration-300 ease-out",
          "starting:translate-x-full motion-reduce:transition-none motion-reduce:starting:translate-x-0",
          drawerWidthClassName[size],
          open ? "translate-x-0" : "translate-x-full",
        )}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget || open) {
            return;
          }

          if (
            event.propertyName === "translate" ||
            event.propertyName === "transform"
          ) {
            setPresent(false);
          }
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-6 pt-6 pb-4">
          <h2 id={titleId} className="min-w-0 flex-1 truncate text-lg font-semibold">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-[15px] bg-[var(--brand)] text-white",
                "transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105",
                "motion-reduce:transition-none",
              )}
            >
              <X className="size-4" strokeWidth={3} aria-hidden />
            </button>
          </div>
        </div>
        <AdminDrawerHeaderActionsContext.Provider value={setHeaderActions}>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </AdminDrawerHeaderActionsContext.Provider>
      </div>
    </div>
  );
}
