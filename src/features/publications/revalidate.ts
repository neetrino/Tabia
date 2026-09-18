import "server-only";

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/routing";
import type { PublicationTypeValue } from "./types";

function publicBasePath(type: PublicationTypeValue): string {
  return type === "NEWS" ? "/news" : "/insights";
}

function adminPath(type: PublicationTypeValue): string {
  return type === "NEWS" ? "/admin/news" : "/admin/insights";
}

export function revalidatePublicationPaths(
  type: PublicationTypeValue,
  slug?: string,
): void {
  revalidatePath(adminPath(type));
  revalidatePath("/admin/news");
  revalidatePath("/admin/insights");

  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}${publicBasePath(type)}`);
    if (slug) {
      revalidatePath(`/${locale}${publicBasePath(type)}/${slug}`);
    }
  }
}
