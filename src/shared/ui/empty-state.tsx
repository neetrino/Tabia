import { cn } from "@/shared/lib/cn";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <p
      className={cn(
        "border border-dashed border-[var(--border)] bg-[var(--cream)] px-6 py-14 text-center text-sm text-[var(--muted)]",
        className,
      )}
    >
      {message}
    </p>
  );
}
