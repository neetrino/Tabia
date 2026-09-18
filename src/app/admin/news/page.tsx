import { AdminGuardedResource } from "@/features/admin";

export default function AdminNewsPage() {
  return <AdminGuardedResource resource="news" />;
}
