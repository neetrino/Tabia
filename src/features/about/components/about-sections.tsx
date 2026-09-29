import { Reveal } from "@/shared/motion/reveal";
import { revealDelay } from "@/shared/motion/timing";
import { ButtonLink } from "@/shared/ui/button-link";
import { cn } from "@/shared/lib/cn";

const proseClassName =
  "text-base font-light leading-[1.75] lg:text-lg lg:leading-[1.8]";

const toneClassName = {
  ink: "text-[#363636]",
  light: "text-white/85",
} as const;

export type AboutMatter = {
  industry: string;
  title: string;
  body: string;
};

export function AboutProse({
  paragraphs,
  className,
  tone = "ink",
}: {
  paragraphs: string[];
  className?: string;
  tone?: keyof typeof toneClassName;
}) {
  return (
    <div className={cn("space-y-5", proseClassName, toneClassName[tone], className)}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export function AboutSectionHeading({ children }: { children: string }) {
  return (
    <h2 className="max-w-[12em] text-[28px] font-semibold uppercase leading-[34px] tracking-[-0.4px] text-[#0a0a0a] lg:text-[40px] lg:leading-[46px]">
      {children}
    </h2>
  );
}

export function AboutExperience({
  title,
  items,
}: {
  title: string;
  items: AboutMatter[];
}) {
  return (
    <section className="mt-16 border-t border-black/10 pt-12 lg:mt-24 lg:pt-16">
      <Reveal>
        <AboutSectionHeading>{title}</AboutSectionHeading>
      </Reveal>
      <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-2 lg:gap-6">
        {items.map((item, index) => (
          <Reveal key={item.industry} className="h-full" delay={revealDelay(index)}>
            <AboutMatterCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutMatterCard({ item }: { item: AboutMatter }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-[var(--surface)] p-6 lg:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
        {item.industry}
      </p>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-[#0a0a0a] lg:text-xl">
        {item.title}
      </h3>
      <p className="mt-4 text-sm font-light leading-relaxed text-[#363636] lg:text-base lg:leading-[1.75]">
        {item.body}
      </p>
    </article>
  );
}

export function AboutCopySection({
  title,
  paragraphs,
  className,
}: {
  title: string;
  paragraphs: string[];
  className?: string;
}) {
  const [lead, ...rest] = paragraphs;

  return (
    <section
      className={cn(
        "mt-16 border-t border-black/10 pt-12 lg:mt-24 lg:pt-16",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <AboutSectionHeading>{title}</AboutSectionHeading>
          {lead ? <AboutProse paragraphs={[lead]} className="mt-6 lg:mt-8" /> : null}
        </Reveal>
        {rest.length > 0 ? (
          <Reveal delay={0.08}>
            <AboutProse paragraphs={rest} />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function AboutNameIntro({
  titleLead,
  titleTail,
  opening,
}: {
  titleLead: string;
  titleTail: string;
  opening?: string;
}) {
  return (
    <div>
      <h2 className="text-[36px] uppercase leading-[44px] text-white lg:text-[56px] lg:leading-[56px]">
        <span className="block font-semibold lg:font-extrabold">{titleLead}</span>
        <span className="mt-[7px] block font-light text-white/80 lg:mt-[9px] lg:font-extralight">
          {titleTail}
        </span>
      </h2>
      {opening ? (
        <p className={cn("mt-8", proseClassName, toneClassName.light)}>{opening}</p>
      ) : null}
    </div>
  );
}

export function AboutName({
  titleLead,
  titleTail,
  paragraphs,
}: {
  titleLead: string;
  titleTail: string;
  paragraphs: string[];
}) {
  const [opening, definition, beside, ...rest] = paragraphs;

  return (
    <section className="relative bg-gradient-to-b from-[#151515] to-[#7a3737] lg:bg-[linear-gradient(126.5deg,#151515_15.214%,#7a3737_81.251%)]">
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-x-16 lg:px-16 lg:py-28">
        <Reveal>
          <div>
            <AboutNameIntro titleLead={titleLead} titleTail={titleTail} opening={opening} />
            {beside ? (
              <AboutProse paragraphs={[beside]} tone="light" className="mt-8" />
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-8">
            {definition ? (
              <blockquote className="rounded-2xl bg-white p-6 text-sm font-light leading-[1.7] text-[#171717] lg:p-8 lg:text-base lg:leading-[1.75]">
                {definition}
              </blockquote>
            ) : null}
            {rest.length > 0 ? <AboutProse paragraphs={rest} tone="light" /> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutClose({ body, action }: { body: string; action: string }) {
  return (
    <Reveal>
      <div className="mt-16 flex flex-col items-start gap-8 border-t border-black/10 pt-10 sm:flex-row sm:items-end sm:justify-between lg:mt-20 lg:pt-12">
        <p className="max-w-[560px] text-[28px] font-light uppercase leading-[34px] text-[#0a0a0a] lg:text-[36px] lg:leading-[44px]">
          {body}
        </p>
        <ButtonLink href="/contact" withArrow className="h-14 shrink-0 px-8">
          {action}
        </ButtonLink>
      </div>
    </Reveal>
  );
}
