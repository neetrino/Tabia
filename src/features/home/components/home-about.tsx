import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HOME_ASSETS } from "@/shared/config/content";
import { cn } from "@/shared/lib/cn";
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
  const cta = t("about.cta");

  return (
    <section className="relative bg-[linear-gradient(126.5deg,#151515_15.214%,#7a3737_81.251%)]">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("about.label")}</SectionLabel>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 lg:hidden">
        <h2 className="text-[clamp(2rem,7vw,3.25rem)] font-extrabold uppercase leading-[1.35] tracking-[-0.03em] text-white">
          {title}
        </h2>
        <AboutStats stats={stats} className="mt-10" />
        <AboutQuoteCard className="mt-10" quote={quote} cta={cta} />
        <div className="relative mx-auto mt-8 h-[280px] w-full max-w-[607px] -scale-x-100">
          <AboutBooksImage />
        </div>
      </div>

      <div className="home-about-stage relative mx-auto hidden max-w-[1440px] lg:block">
        <div className="absolute left-[72px] top-[105px] w-[612px]">
          <h2 className="max-w-[516px] pt-8 text-[52px] font-extrabold uppercase leading-[70px] tracking-[-1.8px] text-white">
            {title}
          </h2>
          <AboutStats stats={stats} className="mt-14 max-w-[516px]" />
        </div>

        <AboutQuoteCard
          className="absolute left-[755px] top-[119px] z-10"
          quote={quote}
          cta={cta}
        />

        <div className="absolute left-[821px] top-[304px] h-[400px] w-[607px] -scale-x-100 overflow-hidden">
          <AboutBooksImage />
        </div>
      </div>
    </section>
  );
}

function AboutStats({
  stats,
  className,
}: {
  stats: AboutStat[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-3 gap-4 border-t border-white/10 pt-10",
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd className="text-[36px] font-extrabold leading-10 text-white">
            {stat.value}
          </dd>
          <p className="pt-1 text-[10px] font-medium uppercase tracking-[1px] text-[var(--muted)]">
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
        className="mt-auto h-14 w-[252px] justify-end gap-3 self-stretch px-8 py-4 text-sm font-semibold uppercase tracking-[1px] text-[#232323] [&_span]:text-[#444]"
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
