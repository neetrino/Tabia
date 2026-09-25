"use client";

import { useTranslations } from "next-intl";
import { AdminDateTimePicker } from "@/features/admin/client";
import type { PublicationRecord } from "../types";
import { PublicationFormField, publicationInputClassName } from "./publication-form-field";

type PublicationValuesChange = (
  update:
    | PublicationRecord
    | ((current: PublicationRecord) => PublicationRecord),
) => void;

type PublicationSharedFieldsProps = {
  values: PublicationRecord;
  onChange: PublicationValuesChange;
};

export function PublicationSharedFields({
  values,
  onChange,
}: PublicationSharedFieldsProps) {
  const t = useTranslations("admin.publicationForm");

  return (
    <>
      <PublicationFormField id="slug" label={t("slug")} hint={t("slugHint")}>
        <input
          id="slug"
          value={values.slug}
          autoComplete="off"
          className={publicationInputClassName}
          onChange={(event) => {
            const slug = event.target.value.trim().toLowerCase();
            onChange((current) => ({ ...current, slug }));
          }}
        />
      </PublicationFormField>
      <PublicationFormField
        id="publishedAt"
        label={t("publishedAt")}
        hint={t("publishedAtHint")}
      >
        <AdminDateTimePicker
          id="publishedAt"
          value={values.publishedAt}
          onChange={(publishedAt) =>
            onChange((current) => ({ ...current, publishedAt }))
          }
        />
      </PublicationFormField>
    </>
  );
}
