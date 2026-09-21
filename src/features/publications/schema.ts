import { z } from "zod";
import { hasRichTextContent, sanitizePublicationHtml } from "./sanitize-html";
import { isLatinSlug } from "./slug";

const MAX_TITLE_LENGTH = 160;
const MAX_SUMMARY_LENGTH = 500;
const MAX_BODY_LENGTH = 50_000;

const requiredText = (max: number) => z.string().trim().min(1).max(max);

const richBody = z
  .string()
  .max(MAX_BODY_LENGTH)
  .transform((value) => sanitizePublicationHtml(value))
  .refine(hasRichTextContent);

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
  titleHy: requiredText(MAX_TITLE_LENGTH),
  titleEn: requiredText(MAX_TITLE_LENGTH),
  titleRu: requiredText(MAX_TITLE_LENGTH),
  summaryHy: requiredText(MAX_SUMMARY_LENGTH),
  summaryEn: requiredText(MAX_SUMMARY_LENGTH),
  summaryRu: requiredText(MAX_SUMMARY_LENGTH),
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
});

export const publicationStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type PublicationInput = z.infer<typeof publicationInputSchema>;
