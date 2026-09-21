import type { AppLocale } from "@/i18n/routing";
import type { TeamMemberRecord } from "./types";

type LocalizedField = "name" | "position" | "bio" | "details";

const FIELD_MAP: Record<
  LocalizedField,
  Record<AppLocale, keyof TeamMemberRecord>
> = {
  name: { hy: "nameHy", en: "nameEn", ru: "nameRu" },
  position: { hy: "positionHy", en: "positionEn", ru: "positionRu" },
  bio: { hy: "bioHy", en: "bioEn", ru: "bioRu" },
  details: { hy: "detailsHy", en: "detailsEn", ru: "detailsRu" },
};

export function teamLocaleField(
  field: LocalizedField,
  locale: AppLocale,
): keyof TeamMemberRecord {
  return FIELD_MAP[field][locale];
}

export function createEmptyTeamMember(sortOrder: number): TeamMemberRecord {
  return {
    id: "",
    slug: "",
    photoUrl: null,
    nameHy: "",
    nameEn: "",
    nameRu: "",
    positionHy: "",
    positionEn: "",
    positionRu: "",
    bioHy: "",
    bioEn: "",
    bioRu: "",
    detailsHy: "",
    detailsEn: "",
    detailsRu: "",
    email: "",
    phone: "",
    linkedInUrl: "",
    sortOrder,
    visibility: "PUBLISHED",
    featured: false,
  };
}
