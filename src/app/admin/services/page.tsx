import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getAdminSession } from "@/features/auth/session";
import {
  getAdminServices,
  getNextServiceSortOrder,
  ServiceAdminPanel,
} from "@/features/services";

export default async function AdminServicesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const locale = await getLocale();
  const [services, nextSortOrder] = await Promise.all([
    getAdminServices(locale),
    getNextServiceSortOrder(),
  ]);

  return (
    <ServiceAdminPanel services={services} nextSortOrder={nextSortOrder} />
  );
}
