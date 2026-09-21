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
    <section className="relative bg-[#fefefe]">
      <div className="home-hero-stage relative mx-auto max-w-[1440px]">
        <div className="pointer-events-none relative mx-auto h-[22rem] w-[min(100%,783px)] overflow-hidden sm:h-[28rem] lg:absolute lg:left-[299px] lg:top-0 lg:mx-0 lg:h-[755px] lg:w-[783px]">
          <Image
            src={HOME_ASSETS.heroChess}
            alt=""
            width={1121}
            height={1403}
            priority
            className="absolute left-[-0.05%] top-[-17.56%] h-[129.97%] w-[100.1%] max-w-none"
            sizes="783px"
          />
        </div>

        <h1 className="sr-only">{t("hero.title")}</h1>

        <p
          aria-hidden
          className="whitespace-pre-line break-words px-6 text-right font-hero text-[clamp(1.75rem,5vw,3.125rem)] uppercase leading-none tracking-[-0.05145em] text-black lg:absolute lg:left-[38px] lg:top-[182px] lg:w-[609px] lg:px-0 lg:text-[50px] lg:leading-[50px] lg:tracking-[-2.5725px]"
        >
          {t("hero.titleLeft")}
        </p>

        <p
          aria-hidden
          className="whitespace-pre-line break-words px-6 font-hero text-[clamp(1.75rem,5vw,3.125rem)] uppercase leading-none tracking-[-0.05145em] text-black lg:absolute lg:left-[785px] lg:top-[332px] lg:w-[588px] lg:px-0 lg:text-[50px] lg:leading-[50px] lg:tracking-[-2.5725px]"
        >
          {t("hero.titleRight")}
        </p>

        <div className="flex flex-col items-start gap-4 px-6 pb-10 pt-8 lg:absolute lg:left-[109px] lg:top-[532px] lg:gap-4 lg:px-0 lg:pb-0 lg:pt-0">
          <ButtonLink
            href="/contact"
            withArrow
            className="h-14 w-full max-w-[21.375rem] gap-3 pl-[21px] pr-8 lg:w-[342px]"
          >
            {t("hero.cta")}
          </ButtonLink>
          <ButtonLink
            href="/services"
            variant="secondary"
            withArrow
            className="h-14 gap-3 px-8"
          >
            {t("hero.secondaryCta")}
          </ButtonLink>
        </div>

        <HeroStats stats={stats} />
      </div>
    </section>
  );
}

function HeroStats({ stats }: { stats: HeroStat[] }) {
  return (
    <dl className="flex flex-wrap items-center justify-center gap-8 px-6 pb-16 lg:absolute lg:left-1/2 lg:top-[755px] lg:-translate-x-1/2 lg:gap-[49px] lg:px-0 lg:pb-0">
      {stats.map((stat, index) => (
        <div key={stat.label} className="contents">
          {index > 0 ? <div className="h-8 w-px bg-black/10" aria-hidden /> : null}
          <div>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-2xl font-bold leading-8 text-black">{stat.value}</dd>
            <p className="pt-0.5 text-[10px] uppercase leading-[15px] tracking-[1px] text-[var(--muted-strong)]">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </dl>
  );
}
