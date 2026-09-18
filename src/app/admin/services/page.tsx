import { AdminGuardedResource } from "@/features/admin";

export default function AdminServicesPage() {
  return <AdminGuardedResource resource="services" />;
}
