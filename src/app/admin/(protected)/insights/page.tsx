import { getLocale } from "next-intl/server";
import {
  getAdminPublications,
  PublicationAdminPanel,
} from "@/features/publications";

export default async function AdminInsightsPage() {
  const locale = await getLocale();
  const publications = await getAdminPublications(locale, "INSIGHT");

  return (
    <PublicationAdminPanel type="INSIGHT" publications={publications} />
  );
}
