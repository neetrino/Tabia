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
    <section className="relative bg-[#090909] lg:bg-black">
      <div className="absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
        <SectionLabel>{t("publications.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-[85px] lg:pb-32 lg:pt-[123px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h2 className="max-w-[362px] text-[36px] font-normal uppercase leading-[44px] text-[var(--cream)] lg:max-w-[914px] lg:text-[56px] lg:leading-[56px]">
            <span className="block lg:font-extrabold">
              {t("publications.titleLead")}
            </span>
            <span className="block text-white lg:mt-[7px] lg:font-extralight">
              {t("publications.titleTail")}
            </span>
          </h2>
          <Link
            href="/news"
            className="hidden shrink-0 self-start border-b border-white/30 pb-1 text-[10px] font-semibold uppercase tracking-[1px] text-white lg:mt-[94px] lg:inline"
          >
            {t("publications.viewAll")} →
          </Link>
        </div>

        <p className="mt-8 hidden max-w-[493px] text-sm uppercase leading-[21px] tracking-[0.35px] text-white lg:mt-[38px] lg:block">
          {t("publications.description")}
        </p>
        <div className="mt-3.5 flex w-[365px] max-w-full items-end gap-4 lg:hidden">
          <p className="w-[266px] shrink-0 text-[11px] uppercase leading-[18px] tracking-[0.35px] text-white">
            <span className="block w-[179px]">{t("publications.description")}</span>
          </p>
          <Link
            href="/news"
            className="shrink-0 border-b border-white/30 pb-1 text-sm uppercase leading-[13.5px] tracking-[1px] text-white"
          >
            {t("publications.viewAllShort")} →
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState
            message={t("publications.empty")}
            className="mt-16 border-white/20 bg-white/5 text-white/70 lg:mt-[65px]"
          />
        ) : (
          <div className="mt-3.5 -mx-5 overflow-x-auto pt-6 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:mt-[65px] lg:overflow-visible lg:pt-0 [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-4 px-5 lg:grid lg:w-auto lg:grid-cols-2 lg:gap-6 lg:px-0">
              {items.map((item) => (
                <PublicationCard
                  key={`${item.type}-${item.slug}`}
                  item={item}
                  locale={locale}
                  typeLabel={
                    item.type === "NEWS"
                      ? common("nav.news")
                      : common("nav.insights")
                  }
                  readMore={readMore}
                />
              ))}
            </div>
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
    <article className="flex w-[347px] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white lg:w-auto lg:flex-row lg:gap-5 lg:overflow-visible lg:border-white/5 lg:p-5">
      <CoverMedia
        src={item.coverUrl}
        alt={item.title}
        className="h-40 w-full shrink-0 rounded-none bg-[#1a1a1a] lg:size-40 lg:rounded-xl"
        imageClassName="object-cover opacity-70"
      />
      <div className="flex min-w-0 flex-1 flex-col p-4 lg:justify-between lg:p-0 lg:py-1">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[9px] uppercase leading-[13.5px] tracking-[1px] text-[var(--brand)] lg:text-[10px] lg:font-semibold lg:leading-[15px]">
              {typeLabel}
            </p>
            {date ? (
              <time
                dateTime={item.publishedAt?.toISOString()}
                className="text-[9px] leading-[13.5px] text-[var(--muted)] lg:text-[10px] lg:leading-[15px]"
              >
                {date}
              </time>
            ) : null}
          </div>
          <h3 className="mt-2 text-[13px] font-normal leading-[18px] text-[#212121] lg:text-sm lg:font-bold lg:leading-[19.25px]">
            {item.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 pb-2.5 text-[11px] leading-[17px] text-[var(--muted)] lg:mt-2 lg:line-clamp-2 lg:pb-0 lg:text-xs lg:font-light lg:leading-[19.5px]">
            {item.summary}
          </p>
        </div>
        <Link
          href={href}
          className="pt-1.5 text-[9px] uppercase leading-[13.5px] tracking-[1px] text-[var(--brand)] lg:mt-3 lg:pt-0 lg:text-[10px] lg:font-semibold lg:leading-[15px]"
        >
          {readMore} →
        </Link>
      </div>
    </article>
  );
}
