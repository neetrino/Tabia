export type ContentVisibilityValue = "PUBLISHED" | "HIDDEN";

export type TeamMemberPreview = {
  slug: string;
  name: string;
  position: string;
  bio: string;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  linkedInUrl: string | null;
  hasProfile: boolean;
};

export type TeamMemberProfile = TeamMemberPreview & {
  details: string;
};

export type TeamMemberRecord = {
  id: string;
  slug: string;
  photoUrl: string | null;
  nameHy: string;
  nameEn: string;
  nameRu: string;
  positionHy: string;
  positionEn: string;
  positionRu: string;
  bioHy: string;
  bioEn: string;
  bioRu: string;
  detailsHy: string;
  detailsEn: string;
  detailsRu: string;
  email: string;
  phone: string;
  linkedInUrl: string;
  sortOrder: number;
  visibility: ContentVisibilityValue;
  featured: boolean;
};

export type TeamMemberAdminItem = TeamMemberRecord & {
  displayName: string;
  displayPosition: string;
};

export type TeamErrorKey =
  | "unauthorized"
  | "invalid"
  | "slugInvalid"
  | "slugTaken"
  | "notFound"
  | "uploadMissing"
  | "uploadTooLarge"
  | "uploadType"
  | "storageUnavailable";

export type TeamActionResult = {
  ok?: true;
  errorKey?: TeamErrorKey;
  invalidFields?: string[];
};
