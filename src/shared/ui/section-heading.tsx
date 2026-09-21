import { cn } from "@/shared/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="max-w-xl text-3xl tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
