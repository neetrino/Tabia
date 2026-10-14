import { z } from "zod";
import {
  hasRichTextContent,
  sanitizeRichTextHtml,
} from "@/shared/ui/rich-text/sanitize-html";
import { requireAnyLocale } from "@/shared/lib/localized-schema";
import { isLatinSlug } from "./slug";

const localizedText = (max: number) => z.string().trim().max(max);

const localizedRichText = z
  .string()
  .max(50_000)
  .transform((value) => {
    const sanitized = sanitizeRichTextHtml(value.trim());
    return hasRichTextContent(sanitized) ? sanitized : "";
  });

export const serviceInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .refine(isLatinSlug, { message: "slugInvalid" }),
  imageUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) {
        return null;
      }
      return value;
    }),
  bodyImageUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => value || null),
  titleHy: localizedText(160),
  titleEn: localizedText(160),
  titleRu: localizedText(160),
  summaryHy: localizedText(500),
  summaryEn: localizedText(500),
  summaryRu: localizedText(500),
  bodyHy: localizedRichText,
  bodyEn: localizedRichText,
  bodyRu: localizedRichText,
  sortOrder: z.number().int().min(0).max(9999),
  visibility: z.enum(["PUBLISHED", "HIDDEN"]),
  featured: z.boolean(),
})
  .superRefine(
    requireAnyLocale([
      ["titleHy", "titleEn", "titleRu"],
      ["summaryHy", "summaryEn", "summaryRu"],
      ["bodyHy", "bodyEn", "bodyRu"],
    ]),
  );

export const serviceFlagsSchema = z
  .object({
    id: z.string().trim().min(1),
    visibility: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
    featured: z.boolean().optional(),
  })
  .refine(
    (value) => value.visibility !== undefined || value.featured !== undefined,
  );

export type ServiceInput = z.infer<typeof serviceInputSchema>;
