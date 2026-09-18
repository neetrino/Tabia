import { AdminGuardedResource } from "@/features/admin";

export default function AdminTeamPage() {
  return <AdminGuardedResource resource="team" />;
}
