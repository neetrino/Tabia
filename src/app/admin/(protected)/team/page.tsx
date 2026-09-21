import { getLocale } from "next-intl/server";
import {
  getAdminTeamMembers,
  getNextTeamSortOrder,
  TeamAdminPanel,
} from "@/features/team";

export default async function AdminTeamPage() {
  const locale = await getLocale();
  const [members, nextSortOrder] = await Promise.all([
    getAdminTeamMembers(locale),
    getNextTeamSortOrder(),
  ]);

  return (
    <TeamAdminPanel members={members} nextSortOrder={nextSortOrder} />
  );
}
