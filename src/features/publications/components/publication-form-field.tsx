import { cn } from "@/shared/lib/cn";

type PublicationFormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export const publicationInputClassName =
  "w-full rounded-[15px] border border-[var(--border)] px-3 py-2 text-sm";

export function PublicationFormField({
  id,
  label,
  hint,
  children,
}: PublicationFormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export function publicationTextAreaClassName(extra?: string): string {
  return cn(publicationInputClassName, "min-h-24 resize-y", extra);
}
