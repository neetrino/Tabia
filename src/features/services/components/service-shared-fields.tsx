"use client";

import { useTranslations } from "next-intl";
import type { ServiceRecord } from "../types";
import { ServiceFormField, serviceInputClassName } from "./service-form-field";

type ServiceValuesChange = (
  update: ServiceRecord | ((current: ServiceRecord) => ServiceRecord),
) => void;

type ServiceSharedFieldsProps = {
  values: ServiceRecord;
  onChange: ServiceValuesChange;
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
    onChange((current) => ({ ...current, [key]: value }));
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
    </>
  );
}
