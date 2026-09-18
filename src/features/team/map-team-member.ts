import type { TeamMember } from "@prisma/client";
import { localizedText } from "@/shared/lib/localized";
import type {
  TeamMemberAdminItem,
  TeamMemberPreview,
  TeamMemberProfile,
  TeamMemberRecord,
} from "./types";

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function toTeamMemberRecord(row: TeamMember): TeamMemberRecord {
  return {
    id: row.id,
    slug: row.slug,
    photoUrl: row.photoUrl,
    nameHy: row.nameHy,
    nameEn: row.nameEn,
    nameRu: row.nameRu,
    positionHy: row.positionHy,
    positionEn: row.positionEn,
    positionRu: row.positionRu,
    bioHy: row.bioHy,
    bioEn: row.bioEn,
    bioRu: row.bioRu,
    detailsHy: row.detailsHy ?? "",
    detailsEn: row.detailsEn ?? "",
    detailsRu: row.detailsRu ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    linkedInUrl: row.linkedInUrl ?? "",
    sortOrder: row.sortOrder,
    visibility: row.visibility,
  };
}

export function toTeamMemberPreview(
  row: TeamMember,
  locale: string,
): TeamMemberPreview {
  const details = localizedText(locale, {
    hy: row.detailsHy ?? "",
    en: row.detailsEn ?? "",
    ru: row.detailsRu ?? "",
  }).trim();

  return {
    slug: row.slug,
    name: localizedText(locale, {
      hy: row.nameHy,
      en: row.nameEn,
      ru: row.nameRu,
    }),
    position: localizedText(locale, {
      hy: row.positionHy,
      en: row.positionEn,
      ru: row.positionRu,
    }),
    bio: localizedText(locale, {
      hy: row.bioHy,
      en: row.bioEn,
      ru: row.bioRu,
    }),
    photoUrl: row.photoUrl,
    email: emptyToNull(row.email ?? ""),
    phone: emptyToNull(row.phone ?? ""),
    linkedInUrl: emptyToNull(row.linkedInUrl ?? ""),
    hasProfile: details.length > 0,
  };
}

export function toTeamMemberProfile(
  row: TeamMember,
  locale: string,
): TeamMemberProfile {
  return {
    ...toTeamMemberPreview(row, locale),
    details: localizedText(locale, {
      hy: row.detailsHy ?? "",
      en: row.detailsEn ?? "",
      ru: row.detailsRu ?? "",
    }),
  };
}

export function toTeamMemberAdminItem(
  row: TeamMember,
  locale: string,
): TeamMemberAdminItem {
  const record = toTeamMemberRecord(row);
  return {
    ...record,
    displayName: localizedText(locale, {
      hy: row.nameHy,
      en: row.nameEn,
      ru: row.nameRu,
    }),
    displayPosition: localizedText(locale, {
      hy: row.positionHy,
      en: row.positionEn,
      ru: row.positionRu,
    }),
  };
}

export function optionalDbText(value: string): string | null {
  return emptyToNull(value);
}
