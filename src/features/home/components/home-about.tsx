import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HOME_ASSETS } from "@/shared/config/content";
import { cn } from "@/shared/lib/cn";
import { Drift, Reveal } from "@/shared/motion/reveal";
import { ButtonLink } from "@/shared/ui/button-link";
import { SectionLabel } from "@/shared/ui/section-label";

type AboutStat = {
  value: string;
  label: string;
};

export async function HomeAbout() {
  const t = await getTranslations("home");
  const stats = t.raw("about.stats") as AboutStat[];
  const title = t.rich("about.title", {
    light: (chunks) => <span className="font-light">{chunks}</span>,
  });
  const quote = t.rich("about.quote", {
    brand: (chunks) => <span className="font-bold">{chunks}</span>,
  });
  const mobileQuote = t.rich("about.quote", {
    brand: (chunks) => chunks,
  });
  const cta = t("about.cta");

  return (
    <section className="relative bg-gradient-to-b from-[#151515] to-[#7a3737] lg:bg-[linear-gradient(126.5deg,#151515_15.214%,#7a3737_81.251%)]">
      <SectionLabel>{t("about.label")}</SectionLabel>

      <HomeAboutMobile label={t("about.label")} quote={mobileQuote} cta={cta} stats={stats} />

      <div className="home-about-stage relative mx-auto hidden max-w-[1440px] lg:block">
        <div className="absolute left-[72px] top-[105px] w-[612px]">
          <Reveal>
            <h2 className="max-w-[516px] pt-8 text-[52px] font-extrabold uppercase leading-[70px] tracking-[-1.8px] text-white">
              {title}
            </h2>
            <AboutStats stats={stats} className="mt-14 max-w-[516px]" />
          </Reveal>
        </div>

        <div className="absolute left-[755px] top-[119px] z-10 w-[320px]">
          <Reveal delay={0.12}>
            <AboutQuoteCard quote={quote} cta={cta} />
          </Reveal>
        </div>

        <div className="absolute left-[821px] top-[304px] h-[400px] w-[607px] -scale-x-100 overflow-hidden">
          <Reveal className="relative size-full" delay={0.2} y={28}>
            <AboutBooksImage />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HomeAboutMobile({
  label,
  quote,
  cta,
  stats,
}: {
  label: string;
  quote: ReactNode;
  cta: string;
  stats: AboutStat[];
}) {
  const [firstWord, ...rest] = label.split(" ");

  return (
    <div className="relative h-[610px] overflow-x-clip lg:hidden">
      <div className="pointer-events-none absolute left-[-185px] top-[-59px] h-[456px] w-[416px]">
        <div className="absolute left-1/2 top-1/2 h-[251px] w-[381px] -translate-x-1/2 -translate-y-1/2 rotate-[57.61deg]">
          <Drift className="relative size-full" distance={8} duration={9}>
            <AboutBooksImage />
          </Drift>
        </div>
      </div>
      <div className="absolute left-[201px] top-[86px] z-10 w-[181px]">
        <Reveal>
        <h2 className="w-[254px] text-[36px] font-semibold uppercase leading-[44px] text-[var(--cream)]">
          {firstWord}
          {rest.length > 0 ? <br /> : null}
          {rest.join(" ")}
        </h2>
        <p className="mt-[18px] text-[13px] leading-5 text-white">{quote}</p>
        <ButtonLink
          href="/about"
          variant="ghost"
          withArrow
          className="mt-[25px] h-6 justify-start gap-2 px-0 py-0 text-xs font-extrabold leading-[18px] tracking-[1px] text-white hover:gap-2 hover:text-white [&_span]:text-base [&_span]:font-normal [&_span]:leading-6 [&_span]:text-white"
        >
          {cta}
        </ButtonLink>
        </Reveal>
      </div>
      <Reveal className="absolute inset-x-[19px] top-[467px]" delay={0.12} y={16}>
        <AboutStats stats={stats} compact />
      </Reveal>
    </div>
  );
}

function AboutStats({
  stats,
  className,
  compact = false,
}: {
  stats: AboutStat[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-3 border-t",
        compact
          ? "gap-x-4 border-black/10 pt-6"
          : "gap-4 border-white/10 pt-10",
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className={cn("min-w-0", compact && "flex flex-col")}>
          <dt className="sr-only">{stat.label}</dt>
          <dd
            className={cn(
              "text-white",
              compact
                ? "text-[28px] font-normal leading-9"
                : "text-[36px] font-extrabold leading-10",
            )}
          >
            {stat.value}
          </dd>
          <p
            className={cn(
              "uppercase tracking-[1px]",
              compact
                ? "mt-auto text-[9px] font-normal leading-[13.5px] text-[#9a9590]"
                : "pt-1 text-[10px] font-medium text-[var(--muted)]",
            )}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </dl>
  );
}

function AboutQuoteCard({
  quote,
  cta,
  className,
}: {
  quote: ReactNode;
  cta: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex h-[284px] w-full max-w-[320px] flex-col rounded-2xl bg-white p-6",
        className,
      )}
    >
      <p className="max-w-[232px] text-sm font-light leading-[22.75px] text-[#171717]">
        {quote}
      </p>
      <ButtonLink
        href="/about"
        variant="ghost"
        withArrow
        className="mt-auto h-14 w-full justify-center gap-3 whitespace-nowrap px-0 py-4 text-sm font-semibold uppercase tracking-[1px] text-[#232323] [&_span]:text-[#444]"
      >
        {cta}
      </ButtonLink>
    </aside>
  );
}

function AboutBooksImage() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={HOME_ASSETS.aboutBooks}
        alt=""
        width={1024}
        height={1024}
        className="absolute left-0 top-[-24.38%] h-[148.75%] w-[98.02%] max-w-none"
        sizes="607px"
      />
    </div>
  );
}
