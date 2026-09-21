import { getTranslations } from "next-intl/server";
import {
  getPublicationHref,
  type PublicationPreview,
} from "@/features/publications";
import { Link } from "@/i18n/navigation";
import { formatPublishedDate } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
import { SectionLabel } from "@/shared/ui/section-label";

type HomePublicationsProps = {
  locale: string;
  items: PublicationPreview[];
};

export async function HomePublications({
  locale,
  items,
}: HomePublicationsProps) {
  const t = await getTranslations("home");
  const common = await getTranslations("common");
  const readMore = common("actions.readMore");

  return (
    <section className="relative bg-[var(--ink)]">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("publications.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-28 lg:px-16">
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-4xl text-[clamp(2rem,5vw,3.5rem)] uppercase leading-[1] text-[var(--cream)]">
            <span className="block font-extrabold">
              {t("publications.titleLead")}
            </span>
            <span className="block font-extralight text-white">
              {t("publications.titleTail")}
            </span>
          </h2>
          <Link
            href="/news"
            className="shrink-0 border-b border-white/30 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-white"
          >
            {t("publications.viewAll")} →
          </Link>
        </div>
        <p className="mb-12 max-w-2xl text-sm uppercase tracking-[0.35px] text-white">
          {t("publications.description")}
        </p>
        {items.length === 0 ? (
          <EmptyState
            message={t("publications.empty")}
            className="border-white/20 bg-white/5 text-white/70"
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {items.map((item) => (
              <PublicationCard
                key={`${item.type}-${item.slug}`}
                item={item}
                locale={locale}
                typeLabel={
                  item.type === "NEWS" ? common("nav.news") : common("nav.insights")
                }
                readMore={readMore}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type PublicationCardProps = {
  item: PublicationPreview;
  locale: string;
  typeLabel: string;
  readMore: string;
};

function PublicationCard({
  item,
  locale,
  typeLabel,
  readMore,
}: PublicationCardProps) {
  const date = formatPublishedDate(locale, item.publishedAt);
  const href = getPublicationHref(item);

  return (
    <article className="flex gap-5 rounded-2xl bg-white p-5">
      <CoverMedia
        src={item.coverUrl}
        alt={item.title}
        className="size-40 shrink-0 rounded-xl bg-[#1a1a1a]"
        imageClassName="object-cover opacity-70"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
              {typeLabel}
            </p>
            {date ? (
              <time
                dateTime={item.publishedAt?.toISOString()}
                className="text-[10px] text-[var(--muted)]"
              >
                {date}
              </time>
            ) : null}
          </div>
          <h3 className="mt-2 text-sm font-bold leading-5 text-[#212121]">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs font-light leading-[19.5px] text-[var(--muted)]">
            {item.summary}
          </p>
        </div>
        <Link
          href={href}
          className="mt-3 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]"
        >
          {readMore} →
        </Link>
      </div>
    </article>
  );
}
