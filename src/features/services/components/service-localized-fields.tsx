"use client";

import { useTranslations } from "next-intl";
import { plainTextToEditorHtml } from "@/shared/ui/rich-text/plain-text";
import { RichTextEditor } from "@/shared/ui/rich-text/rich-text-editor";
import type { AppLocale } from "@/i18n/routing";
import { uploadServiceImageAction } from "../upload";
import { serviceLocaleField } from "../locale-fields";
import { slugifyLatin } from "../slug";
import type { ServiceRecord } from "../types";
import {
  ServiceFormField,
  serviceInputClassName,
  serviceTextAreaClassName,
} from "./service-form-field";

type ServiceValuesChange = (
  update: ServiceRecord | ((current: ServiceRecord) => ServiceRecord),
) => void;

type ServiceLocalizedFieldsProps = {
  locale: AppLocale;
  values: ServiceRecord;
  onChange: ServiceValuesChange;
  onError?: (key: string) => void;
};

function updateLocalizedField(
  onChange: ServiceValuesChange,
  key: keyof ServiceRecord,
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

export function ServiceLocalizedTitleField({
  locale,
  values,
  onChange,
}: ServiceLocalizedFieldsProps) {
  const t = useTranslations("admin.serviceForm");
  const titleKey = serviceLocaleField("title", locale);

  return (
    <ServiceFormField id={titleKey} label={t("title")}>
      <input
        id={titleKey}
        value={String(values[titleKey])}
        className={serviceInputClassName}
        onChange={(event) =>
          updateLocalizedField(onChange, titleKey, event.target.value)
        }
      />
    </ServiceFormField>
  );
}

export function ServiceLocalizedCopyFields({
  locale,
  values,
  onChange,
  onError,
}: ServiceLocalizedFieldsProps) {
  const t = useTranslations("admin.serviceForm");
  const summaryKey = serviceLocaleField("summary", locale);
  const bodyKey = serviceLocaleField("body", locale);

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
          onChange={(event) =>
            updateLocalizedField(onChange, summaryKey, event.target.value)
          }
        />
      </ServiceFormField>
      <ServiceFormField id={bodyKey} label={t("body")} hint={t("bodyHint")}>
        <RichTextEditor
          key={bodyKey}
          id={bodyKey}
          value={plainTextToEditorHtml(String(values[bodyKey]))}
          onChange={(html) => updateLocalizedField(onChange, bodyKey, html)}
          onError={onError ?? (() => undefined)}
          uploadImage={uploadServiceBodyImage}
        />
      </ServiceFormField>
    </>
  );
}

async function uploadServiceBodyImage(file: File): Promise<{
  errorKey?: string;
  url?: string;
}> {
  const formData = new FormData();
  formData.set("image", file);
  return uploadServiceImageAction(formData);
}
