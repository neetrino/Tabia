import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HOME_ASSETS } from "@/shared/config/content";
import { ButtonLink } from "@/shared/ui/button-link";
import { SectionLabel } from "@/shared/ui/section-label";

type AboutStat = {
  value: string;
  label: string;
};

export async function HomeAbout() {
  const t = await getTranslations("home");
  const stats = t.raw("about.stats") as AboutStat[];

  return (
    <section className="relative bg-[linear-gradient(126.5deg,#151515_15%,#7a3737_81%)]">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("about.label")}</SectionLabel>
      </div>
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-6 pb-24 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
        <div>
          <h2 className="max-w-[32rem] text-[clamp(2rem,4vw,3.25rem)] font-extrabold uppercase leading-[1.35] tracking-[-0.03em] text-white">
            {t.rich("about.title", {
              light: (chunks) => <span className="font-light">{chunks}</span>,
            })}
          </h2>
          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-4xl font-extrabold leading-10 text-white">
                  {stat.value}
                </dd>
                <p className="pt-1 text-[10px] font-medium uppercase tracking-[1px] text-[var(--muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative min-h-[28rem]">
          <div className="absolute bottom-0 right-0 h-[400px] w-[min(100%,607px)]">
            <Image
              src={HOME_ASSETS.aboutBooks}
              alt=""
              fill
              className="object-contain object-bottom"
              sizes="607px"
            />
          </div>
          <aside className="relative z-10 max-w-[20rem] rounded-2xl bg-white p-6">
            <p className="text-sm font-light leading-7 text-[#171717]">
              {t.rich("about.quote", {
                brand: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
            </p>
            <ButtonLink
              href="/about"
              variant="ghost"
              className="mt-6 text-sm uppercase tracking-[1px] text-[#232323]"
            >
              {t("about.cta")}
              <span aria-hidden className="text-lg text-[#444]">
                →
              </span>
            </ButtonLink>
          </aside>
        </div>
      </div>
    </section>
  );
}
