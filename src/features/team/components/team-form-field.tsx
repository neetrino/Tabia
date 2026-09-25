import { cn } from "@/shared/lib/cn";

type TeamFormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export const teamInputClassName =
  "w-full rounded-[15px] border border-[var(--border)] px-3 py-2 text-sm";

export function TeamFormField({
  id,
  label,
  hint,
  children,
}: TeamFormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-[var(--muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function teamTextAreaClassName(extra?: string): string {
  return cn(teamInputClassName, "min-h-24 resize-y", extra);
}
