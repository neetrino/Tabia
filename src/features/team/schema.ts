import { z } from "zod";
import {
  hasRichTextContent,
  sanitizeRichTextHtml,
} from "@/shared/ui/rich-text/sanitize-html";
import { requireAnyLocale } from "@/shared/lib/localized-schema";
import { isLatinSlug } from "./slug";

const localizedText = (max: number) => z.string().trim().max(max);
const plainText = z.string().trim();
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value ?? "");

const optionalRichText = z
  .string()
  .transform((value) => {
    const sanitized = sanitizeRichTextHtml(value.trim());
    return hasRichTextContent(sanitized) ? sanitized : "";
  });

export const teamMemberInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .refine(isLatinSlug, { message: "slugInvalid" }),
  photoUrl: z
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
  nameHy: localizedText(120),
  nameEn: localizedText(120),
  nameRu: localizedText(120),
  positionHy: localizedText(160),
  positionEn: localizedText(160),
  positionRu: localizedText(160),
  bioHy: plainText,
  bioEn: plainText,
  bioRu: plainText,
  detailsHy: optionalRichText,
  detailsEn: optionalRichText,
  detailsRu: optionalRichText,
  email: optionalText(200).refine(
    (value) => value.length === 0 || z.string().email().safeParse(value).success,
    { message: "invalid" },
  ),
  phone: optionalText(40),
  linkedInUrl: optionalText(400)
    .transform((value) => {
      if (!value) {
        return "";
      }
      if (/^https?:\/\//i.test(value)) {
        return value;
      }
      return `https://${value}`;
    })
    .refine(
      (value) => value.length === 0 || /^https?:\/\//i.test(value),
      { message: "invalid" },
    ),
  sortOrder: z.number().int().min(0).max(9999),
  visibility: z.enum(["PUBLISHED", "HIDDEN"]),
  featured: z.boolean(),
})
  .superRefine(
    requireAnyLocale([
      ["nameHy", "nameEn", "nameRu"],
      ["positionHy", "positionEn", "positionRu"],
      ["bioHy", "bioEn", "bioRu"],
    ]),
  );

export const teamMemberFlagsSchema = z
  .object({
    id: z.string().trim().min(1),
    visibility: z.enum(["PUBLISHED", "HIDDEN"]).optional(),
    featured: z.boolean().optional(),
  })
  .refine(
    (value) => value.visibility !== undefined || value.featured !== undefined,
  );

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;
