import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HOME_ASSETS } from "@/shared/config/content";
import { Drift, Enter } from "@/shared/motion/reveal";
import { ButtonLink } from "@/shared/ui/button-link";

type HeroStat = {
  value: string;
  label: string;
};

export async function HomeHero() {
  const t = await getTranslations("home");
  const stats = t.raw("hero.stats") as HeroStat[];

  return (
    <section className="relative -mt-28 bg-[#fefefe] lg:-mt-24">
      <div className="home-hero-stage relative mx-auto w-full max-w-[1440px] overflow-hidden lg:overflow-visible">
        <HeroFigure />

        <h1 className="sr-only">{t("hero.title")}</h1>

        <Enter
          className="absolute left-[29px] top-[169px] lg:left-[38px] lg:top-[182px] lg:w-[609px]"
          x={-24}
          y={10}
          delay={0.05}
        >
          <p
            aria-hidden
            className="whitespace-pre-line font-hero text-[25px] uppercase leading-[27px] text-black lg:text-right lg:text-[50px] lg:leading-[50px] lg:tracking-[-2.5725px]"
          >
            {t("hero.titleLeft")}
          </p>
        </Enter>

        <Enter
          className="absolute right-6 top-[620px] lg:left-[785px] lg:right-auto lg:top-[332px] lg:w-[588px]"
          x={24}
          y={10}
          delay={0.18}
        >
          <p
            aria-hidden
            className="whitespace-pre-line text-right font-hero text-[25px] uppercase leading-[27px] text-black lg:text-left lg:text-[50px] lg:leading-[50px] lg:tracking-[-2.5725px]"
          >
            {t("hero.titleRight")}
          </p>
        </Enter>

        <HeroStats stats={stats} />
        <HeroActions
          primaryLabel={t("hero.cta")}
          secondaryLabel={t("hero.secondaryCta")}
        />
      </div>
    </section>
  );
}

function HeroFigure() {
  return (
    <div className="pointer-events-none absolute left-[calc(50%+92.5px)] top-[-46px] h-[704px] w-[729px] -translate-x-1/2 overflow-hidden lg:left-[299px] lg:top-0 lg:h-[755px] lg:w-[783px] lg:translate-x-0">
      <Enter className="relative size-full" delay={0.12} y={18} scale={1.05}>
        <Drift className="relative size-full" distance={14} duration={9}>
          <Image
            src={HOME_ASSETS.heroChess}
            alt=""
            width={1121}
            height={1403}
            priority
            className="absolute left-[-0.05%] top-[-17.56%] h-[129.97%] w-[100.1%] max-w-none"
            sizes="(min-width: 1024px) 783px, 729px"
          />
        </Drift>
      </Enter>
    </div>
  );
}

function HeroActions({
  primaryLabel,
  secondaryLabel,
}: {
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div className="absolute left-1/2 top-[703px] w-[min(352px,calc(100%-50px))] -translate-x-1/2 lg:left-[109px] lg:top-[532px] lg:w-auto lg:translate-x-0">
      <Enter delay={0.42} y={16} className="flex flex-col gap-[7px] lg:items-start lg:gap-4">
        <ButtonLink
        href="/contact"
        withArrow
        className="h-14 w-full gap-3 pl-[21px] pr-8 lg:w-[342px]"
      >
        {primaryLabel}
      </ButtonLink>
        <ButtonLink
        href="/services"
        variant="secondary"
        withArrow
        className="h-14 w-full gap-3 bg-transparent bg-gradient-to-r from-[rgba(33,33,33,0.08)] to-[rgba(135,135,135,0.08)] px-8 text-black hover:bg-transparent hover:text-black lg:w-auto lg:bg-[#151515] lg:bg-none lg:text-white lg:hover:bg-black lg:hover:text-white"
      >
          {secondaryLabel}
        </ButtonLink>
      </Enter>
    </div>
  );
}

function HeroStats({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="absolute left-[29px] top-[373px] lg:left-1/2 lg:top-[755px] lg:-translate-x-1/2">
      <Enter delay={0.32} y={14}>
        <dl className="flex flex-col gap-[5px] lg:flex-row lg:items-center lg:gap-[49px]">
      {stats.map((stat, index) => (
        <div key={stat.label} className="contents">
          {index > 0 ? <div className="h-8 w-px bg-black/10" aria-hidden /> : null}
          <div>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-2xl font-bold leading-8 text-black">{stat.value}</dd>
            <p className="pt-0.5 text-[10px] uppercase leading-[15px] tracking-[1px] text-[#111] lg:text-[var(--muted-strong)]">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
        </dl>
      </Enter>
    </div>
  );
}
