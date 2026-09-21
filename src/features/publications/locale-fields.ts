import type { AppLocale } from "@/i18n/routing";
import type { PublicationRecord, PublicationTypeValue } from "./types";

type LocalizedField = "title" | "summary" | "body";

const FIELD_MAP: Record<
  LocalizedField,
  Record<AppLocale, keyof PublicationRecord>
> = {
  title: { hy: "titleHy", en: "titleEn", ru: "titleRu" },
  summary: { hy: "summaryHy", en: "summaryEn", ru: "summaryRu" },
  body: { hy: "bodyHy", en: "bodyEn", ru: "bodyRu" },
};

export function publicationLocaleField(
  field: LocalizedField,
  locale: AppLocale,
): keyof PublicationRecord {
  return FIELD_MAP[field][locale];
}

export function createEmptyPublication(
  type: PublicationTypeValue,
): PublicationRecord {
  return {
    id: "",
    slug: "",
    type,
    status: "DRAFT",
    coverUrl: null,
    titleHy: "",
    titleEn: "",
    titleRu: "",
    summaryHy: "",
    summaryEn: "",
    summaryRu: "",
    bodyHy: "",
    bodyEn: "",
    bodyRu: "",
    publishedAt: null,
  };
}
