import { cn } from "@/shared/lib/cn";
import { Enter } from "@/shared/motion/reveal";

type InteriorPageHeaderProps = {
  titleLead: string;
  titleTail: string;
  subtitle: string;
  className?: string;
};

/** Shared listing-page hero matching the site typography. */
export function InteriorPageHeader({
  titleLead,
  titleTail,
  subtitle,
  className,
}: InteriorPageHeaderProps) {
  return (
    <header className={cn("max-w-[720px]", className)}>
      <Enter y={16}>
        <h1 className="text-[36px] uppercase leading-[44px] text-[#0a0a0a] lg:text-[56px] lg:leading-[56px]">
          <span className="block font-semibold lg:font-extrabold">{titleLead}</span>
          <span className="mt-[7px] block font-light text-[#0a0a0a]/80 lg:mt-[9px] lg:font-extralight">
            {titleTail}
          </span>
        </h1>
        <p className="mt-6 max-w-[520px] text-[11px] uppercase leading-[18px] tracking-[0.35px] text-[#0a0a0a]/70 lg:mt-8 lg:text-sm lg:leading-[21px]">
          {subtitle}
        </p>
      </Enter>
    </header>
  );
}

type InteriorPageShellProps = {
  children: React.ReactNode;
  className?: string;
};

/** White interior page canvas with site content width. */
export function InteriorPageShell({
  children,
  className,
}: InteriorPageShellProps) {
  return (
    <section className={cn("relative bg-white", className)}>
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-16 lg:px-16 lg:pb-32 lg:pt-24">
        {children}
      </div>
    </section>
  );
}
