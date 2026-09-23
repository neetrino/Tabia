import { getTranslations } from "next-intl/server";
import type { PublicationType } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { formatPublishedDate } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";
import { getPublicationHref, getPublishedPublications } from "../queries";

type PublicationListProps = {
  locale: string;
  type: PublicationType;
};

export async function PublicationList({ locale, type }: PublicationListProps) {
  const namespace = type === "NEWS" ? "news" : "insights";
  const t = await getTranslations(namespace);
  const common = await getTranslations("common");
  const items = await getPublishedPublications({ locale, type });
  const typeLabel =
    type === "NEWS" ? common("nav.news") : common("nav.insights");
  const readMore = common("actions.readMore");

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
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:gap-6">
          {items.map((item) => {
            const date = formatPublishedDate(locale, item.publishedAt);
            const href = getPublicationHref(item);

            return (
              <article
                key={item.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-[var(--surface)] transition duration-300 hover:border-black/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] lg:flex-row lg:gap-5 lg:p-5"
              >
                <CoverMedia
                  src={item.coverUrl}
                  alt={item.title}
                  className="aspect-[16/10] w-full shrink-0 rounded-none bg-[#1a1a1a] lg:aspect-auto lg:size-40 lg:rounded-xl"
                  imageClassName="object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
                />
                <div className="flex min-w-0 flex-1 flex-col p-5 lg:justify-between lg:p-0 lg:py-1">
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
                    <h2 className="mt-2 text-base font-semibold leading-snug text-[#212121] lg:text-lg">
                      {item.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm font-light leading-relaxed text-[var(--muted)]">
                      {item.summary}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className="mt-4 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)] transition group-hover:translate-x-0.5"
                  >
                    {readMore} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </InteriorPageShell>
  );
}
