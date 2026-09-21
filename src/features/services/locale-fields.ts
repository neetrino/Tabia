import type { AppLocale } from "@/i18n/routing";
import type { ServiceRecord } from "./types";

type LocalizedField = "title" | "summary" | "body";

const FIELD_MAP: Record<
  LocalizedField,
  Record<AppLocale, keyof ServiceRecord>
> = {
  title: { hy: "titleHy", en: "titleEn", ru: "titleRu" },
  summary: { hy: "summaryHy", en: "summaryEn", ru: "summaryRu" },
  body: { hy: "bodyHy", en: "bodyEn", ru: "bodyRu" },
};

export function serviceLocaleField(
  field: LocalizedField,
  locale: AppLocale,
): keyof ServiceRecord {
  return FIELD_MAP[field][locale];
}

export function createEmptyService(sortOrder: number): ServiceRecord {
  return {
    id: "",
    slug: "",
    imageUrl: null,
    titleHy: "",
    titleEn: "",
    titleRu: "",
    summaryHy: "",
    summaryEn: "",
    summaryRu: "",
    bodyHy: "",
    bodyEn: "",
    bodyRu: "",
    sortOrder,
    visibility: "PUBLISHED",
    featured: false,
  };
}
