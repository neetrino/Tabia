import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

type ArticleBackLinkProps = {
  href: "/services" | "/team" | "/news" | "/insights";
  label: string;
  className?: string;
};

/** Uppercase back link matching site ghost CTA style. */
export function ArticleBackLink({ href, label, className }: ArticleBackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[1px] text-[var(--brand)]",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
        fill="none"
      >
        <path
          d="M13 8H3M7 4 3 8l4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}

type ArticleTitleProps = {
  children: React.ReactNode;
  className?: string;
};

/** Large article title matching interior page typography. */
export function ArticleTitle({ children, className }: ArticleTitleProps) {
  return (
    <h1
      className={cn(
        "max-w-[920px] text-[32px] font-semibold uppercase leading-[40px] tracking-[-0.5px] text-[#0a0a0a] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1px]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
