"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type AdminSelectOption<T extends string> = {
  value: T;
  label: string;
};

type AdminSelectProps<T extends string> = {
  id: string;
  value: T;
  options: AdminSelectOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: "md" | "sm";
};

const PANEL_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function AdminSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  disabled,
  placeholder,
  size = "md",
}: AdminSelectProps<T>) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const compact = size === "sm";

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[15px] border border-[var(--border)] bg-white text-left text-sm",
          "transition-[border-color,box-shadow,transform] duration-200",
          PANEL_EASE,
          "hover:border-[var(--brand)]/40 focus-visible:border-[var(--brand)]",
          compact ? "px-3 py-1.5" : "gap-3 px-3 py-2.5",
          open && "border-[var(--brand)] shadow-sm",
          disabled && "opacity-60",
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={cn(!selected && "text-[var(--muted)]")}>
          {selected?.label ?? placeholder ?? "—"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[var(--muted)] transition-transform duration-300",
            PANEL_EASE,
            open && "rotate-180 text-[var(--brand)]",
          )}
          aria-hidden
        />
      </button>
      <div
        id={listId}
        role="listbox"
        aria-hidden={!open}
        className={cn(
          "absolute z-[210] mt-2 max-h-60 w-full origin-top overflow-y-auto rounded-[15px] border border-[var(--border)] bg-white p-1 shadow-xl",
          "transition-[opacity,transform,visibility] duration-300",
          PANEL_EASE,
          "motion-reduce:transition-none",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none -translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={active}
              tabIndex={open ? undefined : -1}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm transition-colors duration-200",
                active
                  ? "bg-[var(--brand)] font-medium text-white"
                  : "text-[var(--foreground)] hover:bg-[var(--surface)]",
              )}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
              {active ? <Check className="size-4 shrink-0" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
