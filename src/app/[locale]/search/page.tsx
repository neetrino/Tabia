import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { searchPublications, getPublicationHref } from "@/features/publications";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const query = q?.trim() ?? "";
  const t = await getTranslations("common");
  const items = query ? await searchPublications(locale, query) : [];

  return (
    <InteriorPageShell>
      <InteriorPageHeader
        titleLead={t("search.titleLead")}
        titleTail={t("search.titleTail")}
        subtitle={query ? t("search.subtitle") : t("search.prompt")}
      />
      {!query || items.length === 0 ? (
        <EmptyState
          message={query ? t("search.empty") : t("search.prompt")}
          className="mt-12 lg:mt-16"
        />
      ) : (
        <ul className="mt-12 divide-y divide-black/10 lg:mt-16">
          {items.map((item) => (
            <li key={`${item.type}-${item.slug}`}>
              <Link
                href={getPublicationHref(item)}
                className="block py-5 transition hover:text-[var(--brand)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
                  {item.type === "NEWS" ? t("nav.news") : t("nav.insights")}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#0a0a0a]">{item.title}</h2>
                {item.summary ? (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{item.summary}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </InteriorPageShell>
  );
}
