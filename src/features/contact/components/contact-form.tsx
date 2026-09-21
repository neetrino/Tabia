"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactAction, type ContactState } from "../actions";

const initialState: ContactState = {};
const fieldClassName =
  "w-full rounded-md border border-[var(--border)] bg-white px-3 py-2";

const TEXT_FIELDS = [
  { id: "fullName", type: "text", required: true },
  { id: "email", type: "email", required: true },
  { id: "phone", type: "text", required: false },
  { id: "company", type: "text", required: false },
  { id: "service", type: "text", required: false },
] as const;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const common = useTranslations("common");
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <ContactTextFields />
      <label className="block space-y-1" htmlFor="message">
        <span className="text-sm font-medium">{t("message")}</span>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={fieldClassName}
        />
      </label>
      {state.ok ? (
        <p className="text-sm text-[var(--brand)]">{t("success")}</p>
      ) : null}
      {state.errorKey ? (
        <p className="text-sm text-red-700">{t(state.errorKey)}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? t("pending") : common("actions.submit")}
      </button>
    </form>
  );
}

function ContactTextFields() {
  const t = useTranslations("contact.form");

  return (
    <>
      {TEXT_FIELDS.map((field) => (
        <label key={field.id} className="block space-y-1" htmlFor={field.id}>
          <span className="text-sm font-medium">{t(field.id)}</span>
          <input
            id={field.id}
            name={field.id}
            type={field.type}
            required={field.required}
            className={fieldClassName}
          />
        </label>
      ))}
    </>
  );
}
