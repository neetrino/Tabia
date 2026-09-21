import { setRequestLocale } from "next-intl/server";
import { HomePageContent } from "@/features/home";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageContent locale={locale} />;
}
