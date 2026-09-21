"use client";

import { useTranslations } from "next-intl";
import {
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from "../published-at";
import type { PublicationRecord } from "../types";
import {
  PublicationFormField,
  publicationInputClassName,
} from "./publication-form-field";

type PublicationSharedFieldsProps = {
  values: PublicationRecord;
  onChange: (values: PublicationRecord) => void;
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
          onChange={(event) =>
            onChange({
              ...values,
              slug: event.target.value.trim().toLowerCase(),
            })
          }
        />
      </PublicationFormField>
      <PublicationFormField
        id="publishedAt"
        label={t("publishedAt")}
        hint={t("publishedAtHint")}
      >
        <input
          id="publishedAt"
          type="datetime-local"
          value={toDateTimeLocalValue(values.publishedAt)}
          className={publicationInputClassName}
          onChange={(event) =>
            onChange({
              ...values,
              publishedAt: fromDateTimeLocalValue(event.target.value),
            })
          }
        />
      </PublicationFormField>
    </>
  );
}
