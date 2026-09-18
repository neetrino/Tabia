import { AdminGuardedResource } from "@/features/admin";

export default function AdminInsightsPage() {
  return <AdminGuardedResource resource="insights" />;
}
