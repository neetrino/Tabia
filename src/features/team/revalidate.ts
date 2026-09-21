import "server-only";

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/routing";

export function revalidateTeamPaths(slug?: string): void {
  revalidatePath("/admin/team");

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/team`);
    if (slug) {
      revalidatePath(`/${locale}/team/${slug}`);
    }
  }
}
