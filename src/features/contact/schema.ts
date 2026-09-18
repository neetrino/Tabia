import { z } from "zod";

const optionalLine = z
  .string()
  .trim()
  .max(120)
  .transform((value) => (value.length > 0 ? value : undefined));

export const contactInputSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: optionalLine,
  company: optionalLine,
  service: optionalLine,
  message: z.string().trim().min(1).max(4000),
});
