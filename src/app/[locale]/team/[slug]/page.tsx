import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getPublishedTeamMemberBySlug,
  TeamMemberProfile,
} from "@/features/team";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  const member = await getPublishedTeamMemberBySlug(locale, slug);

  if (!member) {
    return { title: t("title") };
  }

  return {
    title: member.name,
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <TeamMemberProfile locale={locale} slug={slug} />;
}
