import { setRequestLocale } from "next-intl/server";
import { PublicationList } from "@/features/publications";

type PageProps = { params: Promise<{ locale: string }> };

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PublicationList locale={locale} type="NEWS" />;
}
