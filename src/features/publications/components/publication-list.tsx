import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { PublicationType } from "@prisma/client";
import { formatPublishedDate } from "@/shared/lib/localized";
import { ButtonLink } from "@/shared/ui/button-link";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
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

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:px-6">
      <header className="space-y-4">
        <h1 className="text-4xl tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">{t("subtitle")}</p>
      </header>
      {items.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.slug}
              className="group border border-[var(--border)] bg-[var(--surface)]"
            >
              <CoverMedia
                src={item.coverUrl}
                alt={item.title}
                className="aspect-[16/9]"
              />
              <div className="space-y-3 p-6">
                {item.publishedAt ? (
                  <time
                    dateTime={item.publishedAt.toISOString()}
                    className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]"
                  >
                    {formatPublishedDate(locale, item.publishedAt)}
                  </time>
                ) : null}
                <h2 className="text-2xl tracking-tight">{item.title}</h2>
                <p className="text-[var(--muted)]">{item.summary}</p>
                <ButtonLink href={getPublicationHref(item)} variant="ghost">
                  {common("actions.readMore")}
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
