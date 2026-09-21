import type { Service } from "@prisma/client";
import { localizedText } from "@/shared/lib/localized";
import type {
  ServiceAdminItem,
  ServicePreview,
  ServiceProfile,
  ServiceRecord,
} from "./types";

export function toServiceRecord(row: Service): ServiceRecord {
  return {
    id: row.id,
    slug: row.slug,
    imageUrl: row.imageUrl,
    titleHy: row.titleHy,
    titleEn: row.titleEn,
    titleRu: row.titleRu,
    summaryHy: row.summaryHy,
    summaryEn: row.summaryEn,
    summaryRu: row.summaryRu,
    bodyHy: row.bodyHy,
    bodyEn: row.bodyEn,
    bodyRu: row.bodyRu,
    sortOrder: row.sortOrder,
    visibility: row.visibility,
    featured: row.featured,
  };
}

export function toServicePreview(row: Service, locale: string): ServicePreview {
  return {
    slug: row.slug,
    title: localizedText(locale, {
      hy: row.titleHy,
      en: row.titleEn,
      ru: row.titleRu,
    }),
    summary: localizedText(locale, {
      hy: row.summaryHy,
      en: row.summaryEn,
      ru: row.summaryRu,
    }),
    imageUrl: row.imageUrl,
  };
}

export function toServiceProfile(row: Service, locale: string): ServiceProfile {
  return {
    ...toServicePreview(row, locale),
    body: localizedText(locale, {
      hy: row.bodyHy,
      en: row.bodyEn,
      ru: row.bodyRu,
    }),
  };
}

export function toServiceAdminItem(
  row: Service,
  locale: string,
): ServiceAdminItem {
  const record = toServiceRecord(row);
  return {
    ...record,
    displayTitle: localizedText(locale, {
      hy: row.titleHy,
      en: row.titleEn,
      ru: row.titleRu,
    }),
    displaySummary: localizedText(locale, {
      hy: row.summaryHy,
      en: row.summaryEn,
      ru: row.summaryRu,
    }),
  };
}
