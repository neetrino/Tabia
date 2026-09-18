import { setRequestLocale } from "next-intl/server";
import { PublicationArticle } from "@/features/publications";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <PublicationArticle locale={locale} type="NEWS" slug={slug} />;
}
