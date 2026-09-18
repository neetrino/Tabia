import { getTranslations, setRequestLocale } from "next-intl/server";
import { TeamPageContent } from "@/features/team";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TeamPageContent locale={locale} />;
}
