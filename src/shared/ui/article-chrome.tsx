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
        "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)] transition hover:gap-3",
        className,
      )}
    >
      ← {label}
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
