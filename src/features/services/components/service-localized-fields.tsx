"use client";

import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { serviceLocaleField } from "../locale-fields";
import { slugifyLatin } from "../slug";
import type { ServiceRecord } from "../types";
import {
  ServiceFormField,
  serviceInputClassName,
  serviceTextAreaClassName,
} from "./service-form-field";

type ServiceLocalizedFieldsProps = {
  locale: AppLocale;
  values: ServiceRecord;
  onChange: (values: ServiceRecord) => void;
};

function createLocalizedFieldUpdate(
  values: ServiceRecord,
  onChange: (values: ServiceRecord) => void,
) {
  return function updateField(key: keyof ServiceRecord, value: string): void {
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

export function ServiceLocalizedTitleField({
  locale,
  values,
  onChange,
}: ServiceLocalizedFieldsProps) {
  const t = useTranslations("admin.serviceForm");
  const titleKey = serviceLocaleField("title", locale);
  const updateField = createLocalizedFieldUpdate(values, onChange);

  return (
    <ServiceFormField id={titleKey} label={t("title")}>
      <input
        id={titleKey}
        value={String(values[titleKey])}
        className={serviceInputClassName}
        onChange={(event) => updateField(titleKey, event.target.value)}
      />
    </ServiceFormField>
  );
}

export function ServiceLocalizedCopyFields({
  locale,
  values,
  onChange,
}: ServiceLocalizedFieldsProps) {
  const t = useTranslations("admin.serviceForm");
  const summaryKey = serviceLocaleField("summary", locale);
  const bodyKey = serviceLocaleField("body", locale);
  const updateField = createLocalizedFieldUpdate(values, onChange);

  return (
    <>
      <ServiceFormField
        id={summaryKey}
        label={t("summary")}
        hint={t("summaryHint")}
      >
        <textarea
          id={summaryKey}
          value={String(values[summaryKey])}
          className={serviceTextAreaClassName("min-h-24")}
          onChange={(event) => updateField(summaryKey, event.target.value)}
        />
      </ServiceFormField>
      <ServiceFormField id={bodyKey} label={t("body")} hint={t("bodyHint")}>
        <textarea
          id={bodyKey}
          value={String(values[bodyKey])}
          className={serviceTextAreaClassName("min-h-40")}
          onChange={(event) => updateField(bodyKey, event.target.value)}
        />
      </ServiceFormField>
    </>
  );
}
