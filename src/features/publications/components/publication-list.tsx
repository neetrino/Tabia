import { getTranslations } from "next-intl/server";
import type { PublicationType } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import { formatPublishedDate } from "@/shared/lib/localized";
import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/motion/reveal";
import { revealDelay } from "@/shared/motion/timing";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";
import type { PublicationPreview } from "../types";
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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 xl:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              key={`${item.type}-${item.slug}`}
              className="h-full"
              delay={revealDelay(index)}
            >
              <PublicationCard
                item={item}
                locale={locale}
                typeLabel={typeLabel}
                readMore={readMore}
              />
            </Reveal>
          ))}
        </div>
      )}
    </InteriorPageShell>
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
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.06]",
        "bg-[var(--surface)] transition duration-300",
        "hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]",
        "motion-reduce:transform-none",
      )}
    >
      <CoverMedia
        src={item.coverUrl}
        alt={item.title}
        className="aspect-[16/11] w-full bg-[#1a1a1a]"
        imageClassName="object-cover opacity-90 transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="flex flex-1 flex-col p-5 lg:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
            {typeLabel}
          </p>
          {date ? (
            <time
              dateTime={item.publishedAt?.toISOString()}
              className="text-[10px] uppercase tracking-[1px] text-[var(--muted)]"
            >
              {date}
            </time>
          ) : null}
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-[-0.2px] text-[#0a0a0a]">
          {item.title}
        </h2>
        {item.summary ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm font-light leading-relaxed text-[var(--muted)]">
            {item.summary}
          </p>
        ) : null}
        <span className="mt-5 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)] transition duration-300 group-hover:translate-x-0.5">
          {readMore} →
        </span>
      </div>
    </Link>
  );
}
