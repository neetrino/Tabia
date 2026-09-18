import "server-only";

import type { PublicationType } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { localizedText } from "@/shared/lib/localized";

export type PublicationPreview = {
  slug: string;
  type: PublicationType;
  title: string;
  summary: string;
  coverUrl: string | null;
  publishedAt: Date | null;
};

type GetPublishedPublicationsOptions = {
  locale: string;
  type?: PublicationType;
  limit?: number;
};

export async function getPublishedPublications({
  locale,
  type,
  limit,
}: GetPublishedPublicationsOptions): Promise<PublicationPreview[]> {
  const records = await prisma.publication.findMany({
    where: {
      status: "PUBLISHED",
      ...(type ? { type } : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return records.map((record) => ({
    slug: record.slug,
    type: record.type,
    title: localizedText(locale, {
      hy: record.titleHy,
      en: record.titleEn,
      ru: record.titleRu,
    }),
    summary: localizedText(locale, {
      hy: record.summaryHy,
      en: record.summaryEn,
      ru: record.summaryRu,
    }),
    coverUrl: record.coverUrl,
    publishedAt: record.publishedAt,
  }));
}

export function getPublicationHref(item: PublicationPreview): string {
  return item.type === "NEWS" ? `/news/${item.slug}` : `/insights/${item.slug}`;
}

export async function getPublishedPublicationBySlug(
  locale: string,
  type: PublicationType,
  slug: string,
): Promise<(PublicationPreview & { body: string }) | null> {
  const record = await prisma.publication.findUnique({
    where: { type_slug: { type, slug } },
  });

  if (!record || record.status !== "PUBLISHED") {
    return null;
  }

  return {
    slug: record.slug,
    type: record.type,
    title: localizedText(locale, {
      hy: record.titleHy,
      en: record.titleEn,
      ru: record.titleRu,
    }),
    summary: localizedText(locale, {
      hy: record.summaryHy,
      en: record.summaryEn,
      ru: record.summaryRu,
    }),
    body: localizedText(locale, {
      hy: record.bodyHy,
      en: record.bodyEn,
      ru: record.bodyRu,
    }),
    coverUrl: record.coverUrl,
    publishedAt: record.publishedAt,
  };
}
