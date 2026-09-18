import "server-only";

import type { Service } from "@prisma/client";
import { defaultLocale, locales, type AppLocale } from "@/i18n/routing";
import { prisma } from "@/shared/lib/prisma";
import {
  readPublishedServicesCache,
  writePublishedServicesCache,
} from "./cache";
import {
  toServiceAdminItem,
  toServicePreview,
  toServiceProfile,
} from "./map-service";
import type { ServiceAdminItem, ServicePreview, ServiceProfile } from "./types";

function toAppLocale(locale: string): AppLocale {
  return locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : defaultLocale;
}

const publishedOrder = [
  { sortOrder: "asc" as const },
  { createdAt: "desc" as const },
];

async function loadPublishedRows(): Promise<Service[]> {
  return prisma.service.findMany({
    where: { visibility: "PUBLISHED" },
    orderBy: publishedOrder,
  });
}

/** Published services for a public locale, ordered by admin sort. */
export async function getPublishedServices(
  locale: string,
  limit?: number,
): Promise<ServicePreview[]> {
  const appLocale = toAppLocale(locale);
  const cached = await readPublishedServicesCache(appLocale);
  const items =
    cached ??
    (await loadPublishedRows()).map((row) => toServicePreview(row, appLocale));

  if (!cached) {
    await writePublishedServicesCache(appLocale, items);
  }

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/** Published service profile by the shared Latin slug. */
export async function getPublishedServiceBySlug(
  locale: string,
  slug: string,
): Promise<ServiceProfile | null> {
  const row = await prisma.service.findUnique({ where: { slug } });
  if (!row || row.visibility !== "PUBLISHED") {
    return null;
  }

  return toServiceProfile(row, locale);
}

/** All services for the admin list, including hidden records. */
export async function getAdminServices(
  locale: string,
): Promise<ServiceAdminItem[]> {
  const rows = await prisma.service.findMany({
    orderBy: publishedOrder,
  });

  return rows.map((row) => toServiceAdminItem(row, locale));
}

/** Published services marked for the home page, ordered by admin sort. */
export async function getFeaturedServices(
  locale: string,
  limit?: number,
): Promise<ServicePreview[]> {
  const appLocale = toAppLocale(locale);
  const rows = await prisma.service.findMany({
    where: { visibility: "PUBLISHED", featured: true },
    orderBy: publishedOrder,
    ...(typeof limit === "number" ? { take: limit } : {}),
  });

  return rows.map((row) => toServicePreview(row, appLocale));
}

export async function getNextServiceSortOrder(): Promise<number> {
  const latest = await prisma.service.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return (latest?.sortOrder ?? 0) + 1;
}
