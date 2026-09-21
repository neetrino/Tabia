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
    <section className="relative bg-black">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("publications.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-28 lg:px-[85px] lg:pb-32 lg:pt-[123px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h2 className="max-w-[914px] text-[clamp(2rem,5vw,3.5rem)] uppercase leading-none text-[var(--cream)] lg:text-[56px] lg:leading-[56px]">
            <span className="block font-extrabold">
              {t("publications.titleLead")}
            </span>
            <span className="mt-[7px] block font-extralight text-white">
              {t("publications.titleTail")}
            </span>
          </h2>
          <Link
            href="/news"
            className="shrink-0 self-start border-b border-white/30 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-white lg:mt-[94px]"
          >
            {t("publications.viewAll")} →
          </Link>
        </div>

        <p className="mt-8 max-w-[493px] text-sm uppercase leading-[21px] tracking-[0.35px] text-white lg:mt-[38px]">
          {t("publications.description")}
        </p>

        {items.length === 0 ? (
          <EmptyState
            message={t("publications.empty")}
            className="mt-16 border-white/20 bg-white/5 text-white/70 lg:mt-[65px]"
          />
        ) : (
          <div className="mt-16 grid gap-6 lg:mt-[65px] lg:grid-cols-2">
            {items.map((item) => (
              <PublicationCard
                key={`${item.type}-${item.slug}`}
                item={item}
                locale={locale}
                typeLabel={
                  item.type === "NEWS"
                    ? t("publications.categoryNews")
                    : t("publications.categoryInsight")
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
    <article className="flex gap-5 rounded-2xl border border-white/5 bg-white p-5">
      <CoverMedia
        src={item.coverUrl}
        alt={item.title}
        className="size-40 shrink-0 rounded-xl bg-[#1a1a1a]"
        imageClassName="object-cover opacity-70"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[var(--brand)]">
              {typeLabel}
            </p>
            {date ? (
              <time
                dateTime={item.publishedAt?.toISOString()}
                className="text-[10px] leading-[15px] text-[var(--muted)]"
              >
                {date}
              </time>
            ) : null}
          </div>
          <h3 className="mt-2 text-sm font-bold leading-[19.25px] text-[#212121]">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs font-light leading-[19.5px] text-[var(--muted)]">
            {item.summary}
          </p>
        </div>
        <Link
          href={href}
          className="mt-3 text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[var(--brand)]"
        >
          {readMore} →
        </Link>
      </div>
    </article>
  );
}
