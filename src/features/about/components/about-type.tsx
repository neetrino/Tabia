import { cn } from "@/shared/lib/cn";

const wordClassName =
  "uppercase tracking-[-1.2px] text-[#090909] text-[40px] leading-[46px] lg:text-[72px] lg:leading-[70px] lg:tracking-[-1.8px]";

/** Display word used in the About page headlines. */
export function AboutWord({
  children,
  tone,
  className,
}: {
  children: string;
  tone: "heavy" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        wordClassName,
        tone === "heavy" ? "font-extrabold" : "font-extralight",
        className,
      )}
    >
      {children}
    </span>
  );
}

const proseClassName = "text-base font-light leading-normal text-black";

/** Body copy for the About page. */
export function AboutProse({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", proseClassName, className)}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
