export type PublicationTypeValue = "NEWS" | "INSIGHT";
export type PublicationStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PublicationPreview = {
  slug: string;
  type: PublicationTypeValue;
  title: string;
  summary: string;
  coverUrl: string | null;
  publishedAt: Date | null;
};

export type PublicationRecord = {
  id: string;
  slug: string;
  type: PublicationTypeValue;
  status: PublicationStatusValue;
  coverUrl: string | null;
  titleHy: string;
  titleEn: string;
  titleRu: string;
  summaryHy: string;
  summaryEn: string;
  summaryRu: string;
  bodyHy: string;
  bodyEn: string;
  bodyRu: string;
  publishedAt: string | null;
};

export type PublicationAdminItem = PublicationRecord & {
  displayTitle: string;
  displaySummary: string;
  displayDate: string | null;
};

export type PublicationErrorKey =
  | "unauthorized"
  | "invalid"
  | "slugInvalid"
  | "slugTaken"
  | "notFound"
  | "uploadMissing"
  | "uploadTooLarge"
  | "uploadType"
  | "storageUnavailable";

export type PublicationActionResult = {
  ok?: true;
  errorKey?: PublicationErrorKey;
};
