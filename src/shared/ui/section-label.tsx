import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/motion/reveal";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Frosted pill overlapping the seam between home sections (Figma 216:139). */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
      <Reveal y={12} className="pointer-events-auto">
        <p
          className={cn(
            "-mt-7 hidden h-14 w-fit items-center justify-center rounded-full bg-[rgba(223,223,223,0.3)] px-8 py-4 text-base font-semibold leading-4 tracking-[0.3px] text-[#272727] backdrop-blur-[20px] lg:flex",
            className,
          )}
        >
          {children}
        </p>
      </Reveal>
    </div>
  );
}
