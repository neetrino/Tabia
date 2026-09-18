import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getAdminSession } from "@/features/auth/session";
import {
  getAdminTeamMembers,
  getNextTeamSortOrder,
  TeamAdminPanel,
} from "@/features/team";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const locale = await getLocale();
  const [members, nextSortOrder] = await Promise.all([
    getAdminTeamMembers(locale),
    getNextTeamSortOrder(),
  ]);

  return (
    <TeamAdminPanel members={members} nextSortOrder={nextSortOrder} />
  );
}
