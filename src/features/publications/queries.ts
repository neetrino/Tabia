import "server-only";

import type { Publication } from "@prisma/client";
import { defaultLocale, locales, type AppLocale } from "@/i18n/routing";
import { localizedText } from "@/shared/lib/localized";
import { prisma } from "@/shared/lib/prisma";
import {
  filterCachedPublications,
  readPublishedPublicationsCache,
  writePublishedPublicationsCache,
} from "./cache";
import { toPublicationAdminItem, toPublicationPreview } from "./map-publication";
import type {
  PublicationAdminItem,
  PublicationPreview,
  PublicationTypeValue,
} from "./types";

function toAppLocale(locale: string): AppLocale {
  return locales.includes(locale as AppLocale)
    ? (locale as AppLocale)
    : defaultLocale;
}

const publishedOrder = [
  { publishedAt: "desc" as const },
  { createdAt: "desc" as const },
];

async function loadPublishedRows(): Promise<Publication[]> {
  return prisma.publication.findMany({
    where: { status: "PUBLISHED" },
    orderBy: publishedOrder,
  });
}

async function loadPublishedPreviews(
  locale: AppLocale,
): Promise<PublicationPreview[]> {
  const cached = await readPublishedPublicationsCache(locale);
  if (cached) {
    return cached;
  }

  const items = (await loadPublishedRows()).map((row) =>
    toPublicationPreview(row, locale),
  );
  await writePublishedPublicationsCache(locale, items);
  return items;
}

/** Published news and insights for a public locale, newest first. */
export async function getPublishedPublications({
  locale,
  type,
  limit,
}: {
  locale: string;
  type?: PublicationTypeValue;
  limit?: number;
}): Promise<PublicationPreview[]> {
  const items = await loadPublishedPreviews(toAppLocale(locale));
  return filterCachedPublications(items, type, limit);
}

export function getPublicationHref(item: PublicationPreview): string {
  return item.type === "NEWS" ? `/news/${item.slug}` : `/insights/${item.slug}`;
}

export async function getPublishedPublicationBySlug(
  locale: string,
  type: PublicationTypeValue,
  slug: string,
): Promise<(PublicationPreview & { body: string }) | null> {
  const record = await prisma.publication.findUnique({
    where: { type_slug: { type, slug } },
  });

  if (!record || record.status !== "PUBLISHED") {
    return null;
  }

  return {
    ...toPublicationPreview(record, locale),
    body: localizedText(locale, {
      hy: record.bodyHy,
      en: record.bodyEn,
      ru: record.bodyRu,
    }),
  };
}

/** All publications of one type for the admin list. */
export async function getAdminPublications(
  locale: string,
  type: PublicationTypeValue,
): Promise<PublicationAdminItem[]> {
  const rows = await prisma.publication.findMany({
    where: { type },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return rows.map((row) => toPublicationAdminItem(row, locale));
}
