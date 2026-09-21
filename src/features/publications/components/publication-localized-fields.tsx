"use client";

import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { publicationLocaleField } from "../locale-fields";
import { slugifyLatin } from "../slug";
import type { PublicationRecord } from "../types";
import {
  PublicationFormField,
  publicationInputClassName,
  publicationTextAreaClassName,
} from "./publication-form-field";
import { PublicationRichTextEditor } from "./publication-rich-text-editor";

type PublicationLocalizedFieldsProps = {
  locale: AppLocale;
  values: PublicationRecord;
  onChange: (values: PublicationRecord) => void;
  onError: (key: string) => void;
};

function createLocalizedFieldUpdate(
  values: PublicationRecord,
  onChange: (values: PublicationRecord) => void,
) {
  return function updateField(key: keyof PublicationRecord, value: string): void {
    const next = { ...values, [key]: value };
    if (
      key === "titleEn" &&
      (!values.slug || values.slug === slugifyLatin(values.titleEn))
    ) {
      const generated = slugifyLatin(value);
      if (generated) {
        next.slug = generated;
      }
    }
    onChange(next);
  };
}

export function PublicationLocalizedTitleField({
  locale,
  values,
  onChange,
}: Omit<PublicationLocalizedFieldsProps, "onError">) {
  const t = useTranslations("admin.publicationForm");
  const titleKey = publicationLocaleField("title", locale);
  const updateField = createLocalizedFieldUpdate(values, onChange);

  return (
    <PublicationFormField id={titleKey} label={t("title")}>
      <input
        id={titleKey}
        value={String(values[titleKey])}
        className={publicationInputClassName}
        onChange={(event) => updateField(titleKey, event.target.value)}
      />
    </PublicationFormField>
  );
}

export function PublicationLocalizedCopyFields({
  locale,
  values,
  onChange,
  onError,
}: PublicationLocalizedFieldsProps) {
  const t = useTranslations("admin.publicationForm");
  const summaryKey = publicationLocaleField("summary", locale);
  const bodyKey = publicationLocaleField("body", locale);
  const updateField = createLocalizedFieldUpdate(values, onChange);

  return (
    <>
      <PublicationFormField
        id={summaryKey}
        label={t("summary")}
        hint={t("summaryHint")}
      >
        <textarea
          id={summaryKey}
          value={String(values[summaryKey])}
          className={publicationTextAreaClassName("min-h-24")}
          onChange={(event) => updateField(summaryKey, event.target.value)}
        />
      </PublicationFormField>
      <PublicationFormField id={bodyKey} label={t("body")} hint={t("bodyHint")}>
        <PublicationRichTextEditor
          key={bodyKey}
          id={bodyKey}
          value={String(values[bodyKey])}
          onChange={(html) => updateField(bodyKey, html)}
          onError={onError}
        />
      </PublicationFormField>
    </>
  );
}
