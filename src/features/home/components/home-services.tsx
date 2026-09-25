import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ServicePreview } from "@/features/services";
import { Link } from "@/i18n/navigation";
import { HOME_ASSETS, SERVICE_ILLUSTRATION_FRAME } from "@/shared/config/content";
import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/motion/reveal";
import { revealDelay } from "@/shared/motion/timing";
import { EmptyState } from "@/shared/ui/empty-state";
import { SectionLabel } from "@/shared/ui/section-label";

type HomeServicesProps = {
  items: ServicePreview[];
};

export async function HomeServices({ items }: HomeServicesProps) {
  const t = await getTranslations("home");
  const services = await getTranslations("services");

  return (
    <section className="relative bg-gradient-to-b from-[#090909] to-[#2a2a2a]">
      <SectionLabel>{t("services.label")}</SectionLabel>
      <div className="mx-auto max-w-[1400px] px-5 pb-28 pt-12 lg:px-16 lg:pb-32 lg:pt-[105px]">
        <Reveal>
        <div className="flex flex-col gap-[7px] lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="max-w-[363px] text-[36px] uppercase leading-[44px] text-[var(--cream)] lg:max-w-[979px] lg:text-[56px] lg:leading-[56px]">
            <span className="block font-semibold lg:font-extrabold">
              {t("services.titleLead")}
            </span>
            <span className="mt-[7px] block font-light text-white lg:mt-[9px] lg:font-extralight">
              {t("services.titleTail")}
            </span>
          </h2>
          <Link
            href="/services"
            className="hidden shrink-0 self-start border-b border-white/30 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-white lg:mb-1 lg:inline lg:self-auto"
          >
            {t("services.viewAll")} →
          </Link>
        </div>
        </Reveal>

        <Reveal delay={0.08}>
        <div className="mt-3 flex w-full max-w-[362px] items-end gap-4 lg:mt-14 lg:max-w-none">
          <p className="w-[179px] shrink-0 text-[11px] uppercase leading-[18px] tracking-[0.35px] text-white lg:w-auto lg:max-w-[805px] lg:whitespace-pre-line lg:text-sm lg:leading-[21px]">
            {t("services.description")}
          </p>
          <Link
            href="/services"
            className="ml-auto shrink-0 border-b border-white/30 pb-1 text-sm uppercase leading-[13.5px] tracking-[1px] text-white lg:hidden"
          >
            {t("services.viewAllShort")} →
          </Link>
        </div>
        </Reveal>

        {items.length === 0 ? (
          <EmptyState
            message={services("empty")}
            className="mt-16 border-white/20 bg-white/5 text-white/70 lg:mt-20"
          />
        ) : (
          <div className="mt-10 -mx-5 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x pt-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:mt-20 lg:overflow-visible lg:pt-0 lg:touch-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max snap-x snap-mandatory gap-4 px-5 lg:grid lg:w-auto lg:snap-none lg:grid-cols-2 lg:gap-[23px] lg:px-0 xl:grid-cols-3">
              {items.map((item, index) => (
                <Reveal
                  key={item.slug}
                  className="h-full shrink-0 lg:w-auto"
                  delay={revealDelay(index)}
                  y={0}
                >
                  <ServiceCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ item }: { item: ServicePreview }) {
  const frameClass =
    SERVICE_ILLUSTRATION_FRAME[item.slug] ??
    "left-[153px] top-[42px] size-[302px]";

  return (
    <Link
      href={`/services/${item.slug}`}
      className="group relative block h-[260px] w-[calc(100vw-5.5rem)] max-w-[362px] shrink-0 snap-start overflow-hidden rounded-xl bg-[linear-gradient(-43deg,#fff_12%,#999_101%)] transition duration-500 lg:h-[295px] lg:w-auto lg:max-w-none lg:snap-align-none lg:rounded-[10px] lg:bg-[linear-gradient(-57deg,#fff_6%,#d6d6d6_109%)] lg:hover:-translate-y-1 motion-reduce:transition-none motion-reduce:lg:hover:translate-y-0"
    >
      {item.imageUrl ? (
        <>
          <div className="pointer-events-none absolute -bottom-4 right-2 size-[178px] [mask-image:linear-gradient(90deg,transparent,black_18%)] lg:hidden">
            <Image
              src={item.imageUrl}
              alt=""
              fill
              loading="lazy"
              className="object-contain object-center transition duration-500 group-hover:scale-[1.03]"
              sizes="178px"
            />
          </div>
          <div className={cn("absolute hidden overflow-hidden lg:block", frameClass)}>
            <Image
              src={item.imageUrl}
              alt=""
              fill
              loading="lazy"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="410px"
            />
          </div>
        </>
      ) : (
        <div className="pointer-events-none absolute -right-6 top-10 size-[349px]">
          <Image
            src={HOME_ASSETS.serviceScales}
            alt=""
            fill
            loading="lazy"
            className="object-cover"
            sizes="349px"
          />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 lg:gap-6 lg:pt-[23px]">
        <h3 className="line-clamp-3 max-w-[55%] text-sm font-semibold leading-normal text-black lg:max-w-none lg:w-[248px] lg:text-lg">
          {item.title}
        </h3>
        <Image
          src={HOME_ASSETS.serviceArrow}
          alt=""
          width={29}
          height={16}
          unoptimized
          className="mt-1 block shrink-0"
        />
      </div>
    </Link>
  );
}
