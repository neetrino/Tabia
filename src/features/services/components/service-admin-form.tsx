"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { AdminContentLocaleSwitcher } from "@/features/admin/client";
import { defaultLocale, type AppLocale } from "@/i18n/routing";
import { saveServiceAction } from "../actions";
import type { ServiceRecord } from "../types";
import { ServiceImageField } from "./service-image-field";
import {
  ServiceLocalizedCopyFields,
  ServiceLocalizedTitleField,
} from "./service-localized-fields";
import { ServiceSharedFields } from "./service-shared-fields";

type ServiceAdminFormProps = {
  values: ServiceRecord;
  onSaved: () => void;
  onCancel: () => void;
};

export function ServiceAdminForm({
  values: initialValues,
  onSaved,
  onCancel,
}: ServiceAdminFormProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.serviceForm");
  const [values, setValues] = useState(initialValues);
  const [contentLocale, setContentLocale] = useState<AppLocale>(defaultLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(): void {
    startTransition(async () => {
      const { id, ...rest } = values;
      const result = await saveServiceAction({
        ...rest,
        id: id.length > 0 ? id : undefined,
      });
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      onSaved();
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminContentLocaleSwitcher
          value={contentLocale}
          onChange={setContentLocale}
          label={form("contentLocale")}
        />
        <p className="max-w-xl text-xs text-[var(--muted)]">
          {form("contentLocaleHint")}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="max-w-md">
          <ServiceImageField
            imageUrl={values.imageUrl}
            title={values.titleEn || values.titleHy}
            onChange={(url) => setValues({ ...values, imageUrl: url })}
            onError={setErrorKey}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ServiceLocalizedTitleField
            locale={contentLocale}
            values={values}
            onChange={setValues}
          />
          <ServiceSharedFields values={values} onChange={setValues} />
          <div className="space-y-4 md:col-span-2">
            <ServiceLocalizedCopyFields
              locale={contentLocale}
              values={values}
              onChange={setValues}
            />
          </div>
        </div>
      </div>
      {errorKey ? (
        <p className="text-sm text-red-700">{form(`errors.${errorKey}`)}</p>
      ) : null}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? form("saving") : t("actions.save")}
        </button>
        <button
          type="button"
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm"
          onClick={onCancel}
        >
          {t("actions.cancel")}
        </button>
      </div>
    </form>
  );
}
