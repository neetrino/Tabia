"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { ButtonArrow } from "@/shared/ui/button-link";
import { submitContactAction, type ContactState } from "../actions";

const initialState: ContactState = {};

const fieldClassName =
  "mt-1 w-full rounded-[15px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[#171717] outline-none transition-colors placeholder:text-black/35 focus:border-[var(--brand)] focus:bg-white";

const PAIRED_FIELDS = [
  [
    { id: "fullName", type: "text", required: true, autoComplete: "name" },
    { id: "email", type: "email", required: true, autoComplete: "email" },
  ],
  [
    { id: "phone", type: "tel", required: false, autoComplete: "tel" },
    { id: "company", type: "text", required: false, autoComplete: "organization" },
  ],
] as const;

const SERVICE_FIELD = {
  id: "service",
  type: "text",
  required: false,
  autoComplete: "off",
} as const;

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
      className="rounded-[40px] border border-black/10 bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.06)] sm:p-6 lg:rounded-[48px] lg:p-7"
    >
      <div className="border-b border-black/10 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
          {t("eyebrow")}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold leading-7 tracking-tight text-[#171717] lg:text-2xl lg:leading-8">
          {t("title")}
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        <ContactTextFields />
        <label className="block" htmlFor="message">
          <span className="text-sm font-medium text-[#171717]">{t("message")}</span>
          <textarea
            id="message"
            name="message"
            required
            rows={3}
            placeholder={t("message")}
            className={`${fieldClassName} min-h-[88px] resize-y`}
          />
        </label>
      </div>

      {state.ok ? (
        <p className="mt-4 text-sm font-medium text-[var(--brand)]">
          {t("success")}
        </p>
      ) : null}
      {state.errorKey ? (
        <p className="mt-4 text-sm font-medium text-red-700">{t(state.errorKey)}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group mx-auto mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[var(--brand)] px-8 text-base font-semibold tracking-[0.3px] text-[var(--cream)] transition-all hover:bg-[var(--brand-deep)] disabled:opacity-60 sm:w-auto sm:min-w-[200px]"
      >
        {pending ? t("pending") : common("actions.submit")}
        {pending ? null : (
          <ButtonArrow className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
        )}
      </button>
    </form>
  );
}

function ContactTextFields() {
  const t = useTranslations("contact.form");

  return (
    <>
      {PAIRED_FIELDS.map((pair) => (
        <div key={pair[0].id} className="grid gap-3 sm:grid-cols-2">
          {pair.map((field) => (
            <ContactField key={field.id} field={field} label={t(field.id)} />
          ))}
        </div>
      ))}
      <ContactField field={SERVICE_FIELD} label={t(SERVICE_FIELD.id)} />
    </>
  );
}

function ContactField({
  field,
  label,
}: {
  field: {
    id: string;
    type: string;
    required: boolean;
    autoComplete: string;
  };
  label: string;
}) {
  return (
    <label className="block" htmlFor={field.id}>
      <span className="text-sm font-medium text-[#171717]">{label}</span>
      <input
        id={field.id}
        name={field.id}
        type={field.type}
        required={field.required}
        autoComplete={field.autoComplete}
        placeholder={label}
        className={fieldClassName}
      />
    </label>
  );
}
