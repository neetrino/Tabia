import { getLocale } from "next-intl/server";
import {
  getAdminServices,
  getNextServiceSortOrder,
  ServiceAdminPanel,
} from "@/features/services";

export default async function AdminServicesPage() {
  const locale = await getLocale();
  const [services, nextSortOrder] = await Promise.all([
    getAdminServices(locale),
    getNextServiceSortOrder(),
  ]);

  return (
    <ServiceAdminPanel services={services} nextSortOrder={nextSortOrder} />
  );
}
