import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { PublicationType } from "@prisma/client";
import { formatPublishedDate } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import { PublicationBody } from "./publication-body";
import { getPublishedPublicationBySlug } from "../queries";

type PublicationArticleProps = {
  locale: string;
  type: PublicationType;
  slug: string;
};

export async function PublicationArticle({
  locale,
  type,
  slug,
}: PublicationArticleProps) {
  const article = await getPublishedPublicationBySlug(locale, type, slug);

  if (!article) {
    notFound();
  }

  const t = await getTranslations(type === "NEWS" ? "news" : "insights");
  const date = formatPublishedDate(locale, article.publishedAt);

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-16 md:px-6">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          {t("title")}
        </p>
        <h1 className="text-4xl tracking-tight text-balance md:text-5xl">
          {article.title}
        </h1>
        {date ? (
          <time
            dateTime={article.publishedAt?.toISOString()}
            className="block text-sm text-[var(--muted)]"
          >
            {date}
          </time>
        ) : null}
      </header>
      <CoverMedia
        src={article.coverUrl}
        alt={article.title}
        className="aspect-[16/9]"
      />
      <p className="text-lg leading-relaxed text-[var(--muted)]">
        {article.summary}
      </p>
      <PublicationBody html={article.body} />
    </article>
  );
}
