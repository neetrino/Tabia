import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/motion/reveal";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Frosted pill overlapping the top edge of a home section (Figma 1:1015). */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-5 z-20 flex justify-center">
      <Reveal y={0} className="pointer-events-auto">
        <p
          className={cn(
            "hidden h-14 w-fit items-center justify-center whitespace-nowrap rounded-full bg-[rgba(231,231,231,0.62)] px-8 py-4 text-base font-semibold leading-4 tracking-[0.3px] text-[#272727] lg:flex",
            className,
          )}
        >
          {children}
        </p>
      </Reveal>
    </div>
  );
}
