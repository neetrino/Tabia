import { z } from "zod";
import {
  hasRichTextContent,
  sanitizeRichTextHtml,
} from "@/shared/ui/rich-text/sanitize-html";
import { isLatinSlug } from "./slug";

const requiredText = (max: number) => z.string().trim().min(1).max(max);

const requiredRichText = z
  .string()
  .max(50_000)
  .transform((value) => sanitizeRichTextHtml(value.trim()))
  .refine(hasRichTextContent);

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
  titleHy: requiredText(160),
  titleEn: requiredText(160),
  titleRu: requiredText(160),
  summaryHy: requiredText(500),
  summaryEn: requiredText(500),
  summaryRu: requiredText(500),
  bodyHy: requiredRichText,
  bodyEn: requiredRichText,
  bodyRu: requiredRichText,
  sortOrder: z.number().int().min(0).max(9999),
  visibility: z.enum(["PUBLISHED", "HIDDEN"]),
  featured: z.boolean(),
});

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
