"use client";

import { useTranslations } from "next-intl";
import type { ServiceRecord } from "../types";
import { ServiceFormField, serviceInputClassName } from "./service-form-field";

type ServiceSharedFieldsProps = {
  values: ServiceRecord;
  onChange: (values: ServiceRecord) => void;
};

export function ServiceSharedFields({
  values,
  onChange,
}: ServiceSharedFieldsProps) {
  const t = useTranslations("admin.serviceForm");

  function update<K extends keyof ServiceRecord>(
    key: K,
    value: ServiceRecord[K],
  ): void {
    onChange({ ...values, [key]: value });
  }

  return (
    <>
      <ServiceFormField id="slug" label={t("slug")} hint={t("slugHint")}>
        <input
          id="slug"
          value={values.slug}
          autoComplete="off"
          className={serviceInputClassName}
          onChange={(event) =>
            update("slug", event.target.value.trim().toLowerCase())
          }
        />
      </ServiceFormField>
      <ServiceFormField
        id="sortOrder"
        label={t("sortOrder")}
        hint={t("sortOrderHint")}
      >
        <input
          id="sortOrder"
          type="number"
          min={0}
          max={9999}
          value={values.sortOrder}
          className={serviceInputClassName}
          onChange={(event) =>
            update("sortOrder", Number(event.target.value) || 0)
          }
        />
      </ServiceFormField>
    </>
  );
}
