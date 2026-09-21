import "server-only";

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/routing";

export function revalidateServicePaths(slug?: string): void {
  revalidatePath("/admin/services");

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/services`);
    if (slug) {
      revalidatePath(`/${locale}/services/${slug}`);
    }
  }
}
