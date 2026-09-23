import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type DeferredSectionProps = {
  children: ReactNode;
  className?: string;
  /** Approximate reserved height so the page does not jump while the browser skips off-screen work. */
  intrinsicHeight?: string;
};

/**
 * Lets the browser skip layout/paint for off-screen blocks (native lazy rendering).
 * Content stays in the HTML for SEO; images inside should still use loading="lazy".
 */
export function DeferredSection({
  children,
  className,
  intrinsicHeight = "520px",
}: DeferredSectionProps) {
  return (
    <div
      className={cn(
        "[content-visibility:auto]",
        className,
      )}
      style={{ containIntrinsicSize: `auto ${intrinsicHeight}` }}
    >
      {children}
    </div>
  );
}
