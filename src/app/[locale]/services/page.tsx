import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedServices, type ServicePreview } from "@/features/services";
import { Link } from "@/i18n/navigation";
import { HOME_ASSETS } from "@/shared/config/content";
import { Reveal } from "@/shared/motion/reveal";
import { revealDelay } from "@/shared/motion/timing";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const items = await getPublishedServices(locale);

  return (
    <InteriorPageShell>
      <InteriorPageHeader
        titleLead={t("titleLead")}
        titleTail={t("titleTail")}
        subtitle={t("subtitle")}
      />
      {items.length === 0 ? (
        <EmptyState message={t("empty")} className="mt-12 lg:mt-16" />
      ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-6 xl:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.slug} className="h-full" delay={revealDelay(index)}>
              <ServiceCard item={item} />
            </Reveal>
          ))}
        </div>
      )}
    </InteriorPageShell>
  );
}

function ServiceCard({ item }: { item: ServicePreview }) {
  return (
    <Link
      href={`/services/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--surface)] transition duration-500 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <CoverMedia
        src={item.imageUrl}
        alt={item.title}
        className="aspect-[16/10] w-full bg-[#e8e8e8]"
        imageClassName="object-cover object-center opacity-95 transition duration-500 group-hover:scale-[1.03]"
        fallback={
          <div className="relative h-full w-full bg-[linear-gradient(-57deg,#fff_6%,#d6d6d6_109%)]">
            <img
              src={HOME_ASSETS.serviceScales}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-40"
            />
          </div>
        }
      />
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-[#0a0a0a] lg:text-lg">
            {item.title}
          </h2>
          {item.summary ? (
            <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-[var(--muted)]">
              {item.summary}
            </p>
          ) : null}
        </div>
        <img
          src={HOME_ASSETS.serviceArrow}
          alt=""
          width={29}
          height={16}
          className="mt-1 block shrink-0 transition duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
