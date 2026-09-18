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
    <section className="relative bg-[var(--ink)]">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("services.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 lg:px-16">
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-4xl text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[1] text-[var(--cream)]">
            <span className="block font-extrabold">{t("services.titleLead")}</span>
            <span className="block font-extralight text-white">
              {t("services.titleTail")}
            </span>
          </h2>
          <Link
            href="/services"
            className="shrink-0 border-b border-white/30 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-white"
          >
            {t("services.viewAll")} →
          </Link>
        </div>
        <p className="mb-12 max-w-2xl whitespace-pre-line text-sm uppercase tracking-[0.35px] text-white">
          {t("services.description")}
        </p>
        {items.length === 0 ? (
          <EmptyState
            message={services("empty")}
            className="border-white/20 bg-white/5 text-white/70"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
      href="/services"
      className="relative block h-[295px] overflow-hidden rounded-[10px] bg-[linear-gradient(123deg,#fff_6%,#999_109%)]"
    >
      <div className="pointer-events-none absolute -right-6 top-10 size-[349px]">
        <Image
          src={HOME_ASSETS.serviceScales}
          alt=""
          fill
          className="object-cover"
          sizes="349px"
        />
      </div>
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-black">{item.title}</h3>
          <img src={HOME_ASSETS.serviceArrow} alt="" className="mt-2 block shrink-0" />
        </div>
        <p className="mt-3 max-w-[15rem] text-sm font-light leading-[21px] text-black/80">
          {item.summary}
        </p>
      </div>
    </Link>
  );
}
