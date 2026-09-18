import { z } from "zod";
import { isLatinSlug } from "./slug";

const requiredText = (max: number) => z.string().trim().min(1).max(max);

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
  bodyHy: requiredText(8000),
  bodyEn: requiredText(8000),
  bodyRu: requiredText(8000),
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
