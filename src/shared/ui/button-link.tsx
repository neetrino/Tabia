import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

type ButtonLinkProps = {
  href: ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  withArrow?: boolean;
  className?: string;
};

const variantClassName = {
  primary:
    "rounded-full bg-[var(--brand)] px-8 py-4 text-base font-semibold tracking-[0.3px] text-[var(--cream)] hover:bg-[var(--brand-deep)]",
  secondary:
    "rounded-full bg-[#151515] px-8 py-4 text-base font-semibold tracking-[0.3px] text-white hover:bg-black",
  ghost:
    "px-0 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)] hover:gap-3",
  inverse:
    "rounded-full bg-white px-6 py-3 text-base font-semibold tracking-[0.3px] text-[var(--brand)] hover:bg-[var(--cream)]",
} as const;

/** Arrow mark matching Figma node 216:251 (18 / 16 / 0.3 / SemiBold). */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative text-[18px] font-semibold leading-4 tracking-[0.3px]",
        className,
      )}
    >
      →
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  withArrow = false,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-3 transition-all",
        variantClassName[variant],
        className,
      )}
    >
      {children}
      {withArrow ? <ButtonArrow /> : null}
    </Link>
  );
}
