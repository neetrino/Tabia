import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ServicePreview } from "@/features/services";
import { Link } from "@/i18n/navigation";
import { HOME_ASSETS } from "@/shared/config/content";
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
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("services.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-28 lg:px-16 lg:pb-32 lg:pt-[105px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="max-w-[979px] text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none text-[var(--cream)] lg:text-[56px] lg:leading-[56px]">
            <span className="block font-extrabold">{t("services.titleLead")}</span>
            <span className="mt-1 block font-extralight text-white lg:mt-[9px]">
              {t("services.titleTail")}
            </span>
          </h2>
          <Link
            href="/services"
            className="shrink-0 self-start border-b border-white/30 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-white lg:mb-1 lg:self-auto"
          >
            {t("services.viewAll")} →
          </Link>
        </div>

        <p className="mt-10 max-w-[805px] whitespace-pre-line text-sm uppercase leading-[21px] tracking-[0.35px] text-white lg:mt-14">
          {t("services.description")}
        </p>

        {items.length === 0 ? (
          <EmptyState
            message={services("empty")}
            className="mt-16 border-white/20 bg-white/5 text-white/70 lg:mt-20"
          />
        ) : (
          <div className="mt-16 grid gap-[23px] sm:grid-cols-2 xl:grid-cols-3 lg:mt-20">
            {items.map((item) => (
              <ServiceCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ item }: { item: ServicePreview }) {
  return (
    <Link
      href={`/services/${item.slug}`}
      className="group relative block h-[295px] overflow-hidden rounded-[10px] bg-[linear-gradient(-57deg,#fff_6%,#d6d6d6_109%)]"
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt=""
          fill
          className="object-contain object-right-bottom p-4 pt-16 transition duration-500 group-hover:scale-[1.03]"
          sizes="410px"
        />
      ) : (
        <div className="pointer-events-none absolute -right-6 top-10 size-[349px]">
          <Image
            src={HOME_ASSETS.serviceScales}
            alt=""
            fill
            className="object-cover"
            sizes="349px"
          />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-6 px-5 pt-[23px]">
        <h3 className="w-[248px] text-lg font-semibold leading-normal text-black">
          {item.title}
        </h3>
        <img
          src={HOME_ASSETS.serviceArrow}
          alt=""
          width={29}
          height={16}
          className="mt-1 block shrink-0"
        />
      </div>
    </Link>
  );
}
