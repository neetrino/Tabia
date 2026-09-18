"use server";

import { CONTACT_RATE_LIMIT } from "@/shared/config/limits";
import { getClientIp } from "@/shared/lib/client-ip";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import { sendContactEmail } from "./mail";
import { contactInputSchema } from "./schema";
import type { ContactState } from "./types";

export type { ContactState } from "./types";

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const allowed = await consumeRateLimit({
    key: `rl:contact:${await getClientIp()}`,
    maxAttempts: CONTACT_RATE_LIMIT.maxAttempts,
    windowSeconds: CONTACT_RATE_LIMIT.windowSeconds,
  });
  if (!allowed) {
    return { errorKey: "rateLimited" };
  }

  const parsed = contactInputSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    service: formData.get("service"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { errorKey: "invalid" };
  }

  const sent = await sendContactEmail(parsed.data);
  if (sent === "sent") {
    return { ok: true };
  }

  return { errorKey: sent };
}
