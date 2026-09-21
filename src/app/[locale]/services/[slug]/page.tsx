import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedServiceBySlug, ServiceArticle } from "@/features/services";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const service = await getPublishedServiceBySlug(locale, slug);

  if (!service) {
    return { title: t("title") };
  }

  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ServiceArticle locale={locale} slug={slug} />;
}
