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

type PublicationValuesChange = (
  update:
    | PublicationRecord
    | ((current: PublicationRecord) => PublicationRecord),
) => void;

type PublicationLocalizedFieldsProps = {
  locale: AppLocale;
  values: PublicationRecord;
  onChange: PublicationValuesChange;
  onError: (key: string) => void;
};

function updateLocalizedField(
  onChange: PublicationValuesChange,
  key: keyof PublicationRecord,
  value: string,
): void {
  onChange((current) => {
    const next = { ...current, [key]: value };
    if (
      key === "titleEn" &&
      (!current.slug || current.slug === slugifyLatin(current.titleEn))
    ) {
      const generated = slugifyLatin(value);
      if (generated) {
        next.slug = generated;
      }
    }
    return next;
  });
}

export function PublicationLocalizedTitleField({
  locale,
  values,
  onChange,
}: Omit<PublicationLocalizedFieldsProps, "onError">) {
  const t = useTranslations("admin.publicationForm");
  const titleKey = publicationLocaleField("title", locale);

  return (
    <PublicationFormField id={titleKey} label={t("title")}>
      <input
        id={titleKey}
        value={String(values[titleKey])}
        className={publicationInputClassName}
        onChange={(event) =>
          updateLocalizedField(onChange, titleKey, event.target.value)
        }
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

  return (
    <>
      <PublicationFormField
        id={summaryKey}
        label={`${t("summary")} *`}
        hint={t("summaryHint")}
      >
        <textarea
          id={summaryKey}
          value={String(values[summaryKey])}
          maxLength={500}
          className={publicationTextAreaClassName("min-h-24")}
          onChange={(event) =>
            updateLocalizedField(onChange, summaryKey, event.target.value)
          }
        />
        <p className="text-xs text-[var(--muted)]">
          {t("summaryCount", { count: String(values[summaryKey]).length })}
        </p>
      </PublicationFormField>
      <PublicationFormField id={bodyKey} label={t("body")} hint={t("bodyHint")}>
        <PublicationRichTextEditor
          key={bodyKey}
          id={bodyKey}
          value={String(values[bodyKey])}
          onChange={(html) => updateLocalizedField(onChange, bodyKey, html)}
          onError={onError}
        />
      </PublicationFormField>
    </>
  );
}
