import { getLocale } from "next-intl/server";
import {
  getAdminPublications,
  PublicationAdminPanel,
} from "@/features/publications";

export default async function AdminNewsPage() {
  const locale = await getLocale();
  const publications = await getAdminPublications(locale, "NEWS");

  return (
    <PublicationAdminPanel type="NEWS" publications={publications} />
  );
}
