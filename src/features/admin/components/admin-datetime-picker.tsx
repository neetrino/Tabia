"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/shared/lib/cn";
import { AdminSelect } from "./admin-select";

type AdminDateTimePickerProps = {
  id: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  clearLabel?: string;
};

const PANEL_EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const WEEKDAY_COUNT = 7;

type CalendarDay = {
  date: Date;
  inMonth: boolean;
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthCells(month: Date): CalendarDay[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      date,
      inMonth: date.getMonth() === month.getMonth(),
    };
  });
}

function parseValue(iso: string | null): Date | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoFromParts(date: Date, hours: number, minutes: number): string {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function AdminDateTimePicker({
  id,
  value,
  onChange,
  disabled,
  clearLabel = "Clear",
}: AdminDateTimePickerProps) {
  const locale = useLocale();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = parseValue(value);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() =>
    startOfDay(selected ?? new Date()),
  );

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

  const cells = useMemo(() => buildMonthCells(viewMonth), [viewMonth]);
  const weekdayLabels = useMemo(() => {
    const base = new Date(2024, 0, 1);
    return Array.from({ length: WEEKDAY_COUNT }, (_, index) => {
      const day = new Date(base);
      day.setDate(base.getDate() + index);
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(day);
    });
  }, [locale]);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  const displayValue = selected
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(selected)
    : "";

  const hours = selected?.getHours() ?? 12;
  const minutes = selected?.getMinutes() ?? 0;

  function chooseDay(day: Date): void {
    onChange(toIsoFromParts(day, hours, minutes));
  }

  function changeTime(nextHours: number, nextMinutes: number): void {
    const base = selected ?? new Date();
    onChange(toIsoFromParts(base, nextHours, nextMinutes));
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-[15px] border border-[var(--border)] bg-white px-3 py-2.5 text-left text-sm",
          "transition-[border-color,box-shadow] duration-200",
          PANEL_EASE,
          "hover:border-[var(--brand)]/40",
          open && "border-[var(--brand)] shadow-sm",
          disabled && "opacity-60",
        )}
        onClick={() => {
          setOpen((current) => {
            const next = !current;
            if (next) {
              setViewMonth(startOfDay(selected ?? new Date()));
            }
            return next;
          });
        }}
      >
        <span className={cn("truncate", !selected && "text-[var(--muted)]")}>
          {selected ? displayValue : "—"}
        </span>
        <CalendarDays
          className={cn(
            "size-4 shrink-0 text-[var(--muted)] transition-colors duration-200",
            open && "text-[var(--brand)]",
          )}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        role="dialog"
        aria-hidden={!open}
        className={cn(
          "absolute z-30 mt-2 w-[min(100%,22rem)] origin-top rounded-[15px] border border-[var(--border)] bg-white p-3 shadow-xl",
          "transition-[opacity,transform,visibility] duration-300",
          PANEL_EASE,
          "motion-reduce:transition-none",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible pointer-events-none -translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Previous month"
            className="flex size-8 items-center justify-center rounded-[12px] text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            onClick={() =>
              setViewMonth(
                new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
              )
            }
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <p className="text-sm font-semibold capitalize">{monthLabel}</p>
          <button
            type="button"
            aria-label="Next month"
            className="flex size-8 items-center justify-center rounded-[12px] text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            onClick={() =>
              setViewMonth(
                new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
              )
            }
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="py-1 text-center text-[11px] font-medium text-[var(--muted)]"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell) => {
            const active = selected ? sameDay(cell.date, selected) : false;
            const today = sameDay(cell.date, new Date());
            return (
              <button
                key={cell.date.toISOString()}
                type="button"
                tabIndex={open ? undefined : -1}
                className={cn(
                  "flex size-9 items-center justify-center rounded-[12px] text-sm transition duration-200",
                  PANEL_EASE,
                  !cell.inMonth && "text-[var(--muted)]/45",
                  cell.inMonth && !active && "hover:bg-[var(--surface)]",
                  today && !active && "ring-1 ring-[var(--brand)]/30",
                  active && "bg-[var(--brand)] font-semibold text-white",
                )}
                onClick={() => chooseDay(cell.date)}
              >
                {cell.date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2 border-t border-[var(--border)] pt-3">
          <AdminSelect
            id={`${id}-hours`}
            value={String(hours)}
            options={Array.from({ length: 24 }, (_, hour) => ({
              value: String(hour),
              label: pad(hour),
            }))}
            onChange={(next) => changeTime(Number(next), minutes)}
          />
          <span className="text-sm text-[var(--muted)]">:</span>
          <AdminSelect
            id={`${id}-minutes`}
            value={String(minutes)}
            options={Array.from({ length: 60 }, (_, minute) => ({
              value: String(minute),
              label: pad(minute),
            }))}
            onChange={(next) => changeTime(hours, Number(next))}
          />
          <button
            type="button"
            aria-label={clearLabel}
            title={clearLabel}
            className="flex size-9 shrink-0 items-center justify-center rounded-[12px] text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
            onClick={() => onChange(null)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
