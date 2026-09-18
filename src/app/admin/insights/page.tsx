import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getAdminSession } from "@/features/auth/session";
import {
  getAdminPublications,
  PublicationAdminPanel,
} from "@/features/publications";

export default async function AdminInsightsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const locale = await getLocale();
  const publications = await getAdminPublications(locale, "INSIGHT");

  return (
    <PublicationAdminPanel type="INSIGHT" publications={publications} />
  );
}
