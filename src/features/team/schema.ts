import { z } from "zod";
import { isLatinSlug } from "./slug";

const requiredText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value ?? "");

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
  nameHy: requiredText(120),
  nameEn: requiredText(120),
  nameRu: requiredText(120),
  positionHy: requiredText(160),
  positionEn: requiredText(160),
  positionRu: requiredText(160),
  bioHy: requiredText(500),
  bioEn: requiredText(500),
  bioRu: requiredText(500),
  detailsHy: optionalText(8000),
  detailsEn: optionalText(8000),
  detailsRu: optionalText(8000),
  email: optionalText(200).refine(
    (value) => value.length === 0 || z.string().email().safeParse(value).success,
    { message: "invalid" },
  ),
  phone: optionalText(40),
  linkedInUrl: optionalText(400).refine(
    (value) => value.length === 0 || /^https?:\/\//i.test(value),
    { message: "invalid" },
  ),
  sortOrder: z.number().int().min(0).max(9999),
  visibility: z.enum(["PUBLISHED", "HIDDEN"]),
  featured: z.boolean(),
});

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
