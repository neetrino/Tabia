import "server-only";

import { prisma } from "@/shared/lib/prisma";
import { localizedText } from "@/shared/lib/localized";

export type ServicePreview = {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string | null;
};

export async function getPublishedServices(
  locale: string,
  limit?: number,
): Promise<ServicePreview[]> {
  const records = await prisma.service.findMany({
    where: { visibility: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });

  return records.map((record) => ({
    slug: record.slug,
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
    imageUrl: record.imageUrl,
  }));
}
