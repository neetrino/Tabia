import { cn } from "@/shared/lib/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Overlapping section pill between home blocks (Figma 216:139). */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "mx-auto flex h-14 w-fit items-center justify-center rounded-full bg-[rgba(223,223,223,0.62)] px-8 py-4 text-base font-semibold leading-4 tracking-[0.3px] text-[#272727]",
        className,
      )}
    >
      {children}
    </p>
  );
}
