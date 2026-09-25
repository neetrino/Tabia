export type ContentVisibilityValue = "PUBLISHED" | "HIDDEN";

export type ServicePreview = {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string | null;
};

export type ServiceProfile = ServicePreview & {
  body: string;
};

export type ServiceRecord = {
  id: string;
  slug: string;
  imageUrl: string | null;
  titleHy: string;
  titleEn: string;
  titleRu: string;
  summaryHy: string;
  summaryEn: string;
  summaryRu: string;
  bodyHy: string;
  bodyEn: string;
  bodyRu: string;
  sortOrder: number;
  visibility: ContentVisibilityValue;
  featured: boolean;
};

export type ServiceAdminItem = ServiceRecord & {
  displayTitle: string;
  displaySummary: string;
};

export type ServiceErrorKey =
  | "unauthorized"
  | "invalid"
  | "slugInvalid"
  | "slugTaken"
  | "notFound"
  | "uploadMissing"
  | "uploadTooLarge"
  | "uploadType"
  | "storageUnavailable";

export type ServiceActionResult = {
  ok?: true;
  errorKey?: ServiceErrorKey;
  invalidFields?: string[];
};
