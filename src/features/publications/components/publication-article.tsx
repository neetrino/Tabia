import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { PublicationType } from "@prisma/client";
import { formatPublishedDate } from "@/shared/lib/localized";
import { ArticleBackLink } from "@/shared/ui/article-chrome";
import { CoverMedia } from "@/shared/ui/cover-media";
import { InteriorPageShell } from "@/shared/ui/interior-page-header";
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

  const namespace = type === "NEWS" ? "news" : "insights";
  const t = await getTranslations(namespace);
  const common = await getTranslations("common");
  const date = formatPublishedDate(locale, article.publishedAt);
  const backHref = type === "NEWS" ? "/news" : "/insights";
  const typeLabel =
    type === "NEWS" ? common("nav.news") : common("nav.insights");

  return (
    <InteriorPageShell>
      <article>
        <ArticleBackLink href={backHref} label={t("title")} />

        <div className="mt-8 overflow-hidden rounded-[28px] bg-[#111] lg:mt-10 lg:rounded-[36px]">
          <div className="relative">
            <CoverMedia
              src={article.coverUrl}
              alt={article.title}
              className="aspect-[16/10] w-full bg-[#1a1a1a] lg:aspect-[21/9]"
              imageClassName="object-cover opacity-75"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--cream)] backdrop-blur-sm">
                  {typeLabel}
                </span>
                {date ? (
                  <time
                    dateTime={article.publishedAt?.toISOString()}
                    className="text-[10px] uppercase tracking-[1px] text-white/55"
                  >
                    {date}
                  </time>
                ) : null}
              </div>
              <h1 className="mt-4 max-w-[900px] text-[28px] font-semibold leading-[1.15] tracking-[-0.5px] text-white lg:text-[48px] lg:leading-[1.08] lg:tracking-[-1px]">
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        {article.summary ? (
          <p className="mx-auto mt-10 max-w-[720px] border-l-2 border-[var(--brand)] pl-5 text-base font-light leading-7 text-[#363636] lg:mt-12 lg:text-lg lg:leading-8">
            {article.summary}
          </p>
        ) : null}

        <div className="mx-auto mt-10 max-w-[720px] text-base font-light leading-[1.75] text-[#363636] lg:mt-12 lg:text-lg lg:leading-[1.8]">
          <PublicationBody html={article.body} />
        </div>
      </article>
    </InteriorPageShell>
  );
}
