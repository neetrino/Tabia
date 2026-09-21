import type { Publication } from "@prisma/client";
import { formatPublishedDate, localizedText } from "@/shared/lib/localized";
import type {
  PublicationAdminItem,
  PublicationPreview,
  PublicationRecord,
} from "./types";

export function toIsoDate(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export function toPublicationRecord(row: Publication): PublicationRecord {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    status: row.status,
    coverUrl: row.coverUrl,
    titleHy: row.titleHy,
    titleEn: row.titleEn,
    titleRu: row.titleRu,
    summaryHy: row.summaryHy,
    summaryEn: row.summaryEn,
    summaryRu: row.summaryRu,
    bodyHy: row.bodyHy,
    bodyEn: row.bodyEn,
    bodyRu: row.bodyRu,
    publishedAt: toIsoDate(row.publishedAt),
  };
}

export function toPublicationPreview(
  row: Publication,
  locale: string,
): PublicationPreview {
  return {
    slug: row.slug,
    type: row.type,
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
    coverUrl: row.coverUrl,
    publishedAt: row.publishedAt,
  };
}

export function toPublicationAdminItem(
  row: Publication,
  locale: string,
): PublicationAdminItem {
  const record = toPublicationRecord(row);
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
    displayDate: formatPublishedDate(locale, row.publishedAt),
  };
}
