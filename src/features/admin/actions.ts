"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAppLocale } from "@/i18n/locale";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  type AppLocale,
} from "@/i18n/routing";

export async function setAdminLocaleAction(locale: AppLocale): Promise<void> {
  if (!isAppLocale(locale)) {
    return;
  }

  const store = await cookies();
  store.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });
  revalidatePath("/", "layout");
}
