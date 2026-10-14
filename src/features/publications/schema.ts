import { z } from "zod";
import { requireAnyLocale } from "@/shared/lib/localized-schema";
import { hasRichTextContent, sanitizePublicationHtml } from "./sanitize-html";
import { isLatinSlug } from "./slug";

const MAX_TITLE_LENGTH = 160;
const MAX_SUMMARY_LENGTH = 500;
const MAX_BODY_LENGTH = 50_000;

const localizedText = (max: number) => z.string().trim().max(max);

const richBody = z
  .string()
  .max(MAX_BODY_LENGTH)
  .transform((value) => {
    const sanitized = sanitizePublicationHtml(value);
    return hasRichTextContent(sanitized) ? sanitized : "";
  });

export const publicationInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  type: z.enum(["NEWS", "INSIGHT"]),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .refine(isLatinSlug, { message: "slugInvalid" }),
  coverUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => value || null),
  bodyImageUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => value || null),
  galleryUrls: z.array(z.string().trim().min(1).max(500)).max(12).default([]),
  titleHy: localizedText(MAX_TITLE_LENGTH),
  titleEn: localizedText(MAX_TITLE_LENGTH),
  titleRu: localizedText(MAX_TITLE_LENGTH),
  summaryHy: localizedText(MAX_SUMMARY_LENGTH),
  summaryEn: localizedText(MAX_SUMMARY_LENGTH),
  summaryRu: localizedText(MAX_SUMMARY_LENGTH),
  bodyHy: richBody,
  bodyEn: richBody,
  bodyRu: richBody,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      { message: "invalid" },
    )
    .transform((value) => {
      if (!value) {
        return null;
      }
      return new Date(value).toISOString();
    }),
})
  .superRefine(
    requireAnyLocale([
      ["titleHy", "titleEn", "titleRu"],
      ["summaryHy", "summaryEn", "summaryRu"],
      ["bodyHy", "bodyEn", "bodyRu"],
    ]),
  );

export const publicationStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const publicationFeaturedSchema = z.object({
  id: z.string().trim().min(1),
  featured: z.boolean(),
});

export type PublicationInput = z.infer<typeof publicationInputSchema>;
