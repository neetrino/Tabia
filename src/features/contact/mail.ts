import "server-only";

import { Resend } from "resend";
import { logError } from "@/shared/lib/logger";
import type { ContactInput } from "./types";

type Mailer = {
  resend: Resend;
  from: string;
  to: string;
};

function getMailer(): Mailer | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !from || !to) {
    return null;
  }

  return { resend: new Resend(apiKey), from, to };
}

function formatContactEmail(input: ContactInput): string {
  return [
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone ?? "—"}`,
    `Company: ${input.company ?? "—"}`,
    `Service: ${input.service ?? "—"}`,
    "",
    input.message,
  ].join("\n");
}

export async function sendContactEmail(
  input: ContactInput,
): Promise<"sent" | "unavailable" | "error"> {
  const mailer = getMailer();
  if (!mailer) {
    return "unavailable";
  }

  try {
    const result = await mailer.resend.emails.send({
      from: mailer.from,
      to: mailer.to,
      replyTo: input.email,
      subject: `TABIA contact: ${input.fullName}`,
      text: formatContactEmail(input),
    });

    if (result.error) {
      logError("contact-mail", result.error);
      return "error";
    }

    return "sent";
  } catch (error) {
    logError("contact-mail", error);
    return "error";
  }
}
