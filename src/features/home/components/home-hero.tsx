import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HOME_ASSETS } from "@/shared/config/content";
import { ButtonLink } from "@/shared/ui/button-link";

type HeroStat = {
  value: string;
  label: string;
};

export async function HomeHero() {
  const t = await getTranslations("home");
  const stats = t.raw("hero.stats") as HeroStat[];

  return (
    <section className="relative bg-white">
      <div className="home-hero-stage relative mx-auto max-w-[1440px]">
        <div className="pointer-events-none relative mx-auto h-[22rem] w-[min(100%,783px)] sm:h-[28rem] lg:absolute lg:left-1/2 lg:top-0 lg:h-[755px] lg:w-[783px] lg:-translate-x-[calc(50%+30px)]">
          <Image
            src={HOME_ASSETS.heroChess}
            alt=""
            fill
            priority
            className="object-contain object-top"
            sizes="783px"
          />
        </div>
        <h1 className="sr-only">{t("hero.title")}</h1>
        <p
          aria-hidden
          className="whitespace-pre-line break-words px-6 text-right font-hero text-[clamp(1.75rem,5vw,3.125rem)] font-normal uppercase leading-none tracking-[-0.05em] text-black lg:absolute lg:left-[calc(50%-720px)] lg:top-[182px] lg:w-[609px] lg:px-0"
        >
          {t("hero.titleLeft")}
        </p>
        <p
          aria-hidden
          className="whitespace-pre-line break-words px-6 font-hero text-[clamp(1.75rem,5vw,3.125rem)] font-normal uppercase leading-none tracking-[-0.05em] text-black lg:absolute lg:left-[785px] lg:top-[332px] lg:px-0"
        >
          {t("hero.titleRight")}
        </p>
        <div className="flex flex-col items-start gap-4 px-6 pb-10 pt-8 lg:absolute lg:left-[204px] lg:top-[523px] lg:px-0 lg:pb-0 lg:pt-0">
          <ButtonLink href="/contact" className="min-h-14 w-full max-w-[21.375rem]">
            {t("hero.cta")}
            <span aria-hidden className="text-lg">
              →
            </span>
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary" className="min-h-14">
            {t("hero.secondaryCta")}
            <span aria-hidden className="text-lg">
              →
            </span>
          </ButtonLink>
        </div>
        <HeroStats stats={stats} />
      </div>
    </section>
  );
}

function HeroStats({ stats }: { stats: HeroStat[] }) {
  return (
    <dl className="flex flex-wrap items-center justify-center gap-8 px-6 pb-16 lg:absolute lg:inset-x-0 lg:top-[755px] lg:pb-0">
      {stats.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-8">
          {index > 0 ? <div className="h-8 w-px bg-black/10" /> : null}
          <div>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-2xl font-bold leading-8 text-black">{stat.value}</dd>
            <p className="pt-0.5 text-[10px] uppercase tracking-[1px] text-[var(--muted-strong)]">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </dl>
  );
}
