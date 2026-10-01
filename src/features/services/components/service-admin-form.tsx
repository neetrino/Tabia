"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  AdminConfirmDialog,
  AdminContentLocaleSwitcher,
  AdminDrawerHeaderActions,
} from "@/features/admin/client";
import { defaultLocale, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";
import { saveServiceAction } from "../actions";
import type { ContentVisibilityValue, ServiceRecord } from "../types";
import { ServiceImageField } from "./service-image-field";
import {
  ServiceLocalizedCopyFields,
  ServiceLocalizedTitleField,
} from "./service-localized-fields";
import { ServiceSharedFields } from "./service-shared-fields";

type ServiceAdminFormProps = {
  values: ServiceRecord;
  onSaved: () => void;
  onChanged?: () => void;
  onCancel: () => void;
};

export function ServiceAdminForm({
  values: initialValues,
  onSaved,
  onChanged,
  onCancel,
}: ServiceAdminFormProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.serviceForm");
  const [values, setValues] = useState(initialValues);
  const [contentLocale, setContentLocale] = useState<AppLocale>(defaultLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [confirmHide, setConfirmHide] = useState(false);

  const isPublished = values.visibility === "PUBLISHED";
  const displayTitle =
    values.titleEn.trim() ||
    values.titleHy.trim() ||
    values.titleRu.trim() ||
    values.slug;

  function submit(
    options: {
      close: boolean;
      visibility?: ContentVisibilityValue;
    } = { close: true },
  ): void {
    startTransition(async () => {
      const { id, ...rest } = values;
      const visibility = options.visibility ?? values.visibility;
      const result = await saveServiceAction({
        ...rest,
        visibility,
        id: id.length > 0 ? id : undefined,
      });
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        setInvalidFields(result.invalidFields ?? []);
        return;
      }
      setValues((current) => ({ ...current, visibility }));
      if (options.close) {
        onSaved();
        return;
      }
      onChanged?.();
    });
  }

  function handleVisibilityChange(visibility: ContentVisibilityValue): void {
    if (visibility === values.visibility) {
      return;
    }

    if (visibility === "HIDDEN" && values.id) {
      setConfirmHide(true);
      return;
    }

    if (values.id) {
      submit({ close: false, visibility });
      return;
    }

    setValues((current) => ({ ...current, visibility }));
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit({ close: true });
      }}
    >
      <AdminDrawerHeaderActions>
        <button
          type="button"
          role="switch"
          aria-checked={isPublished}
          aria-label={isPublished ? form("hidden") : form("published")}
          title={isPublished ? form("hidden") : form("published")}
          disabled={pending}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "motion-reduce:transition-none disabled:opacity-60",
            isPublished ? "bg-emerald-500" : "bg-red-500",
          )}
          onClick={() =>
            handleVisibilityChange(isPublished ? "HIDDEN" : "PUBLISHED")
          }
        >
          <span
            className={cn(
              "absolute top-0.5 size-6 rounded-full bg-white",
              "transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none",
              isPublished ? "left-[1.375rem]" : "left-0.5",
            )}
          />
        </button>
      </AdminDrawerHeaderActions>
      <AdminContentLocaleSwitcher
        value={contentLocale}
        onChange={setContentLocale}
        label={form("contentLocale")}
      />
      <div className="grid gap-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:items-stretch">
        <ServiceImageField
          imageUrl={values.imageUrl}
          title={values.titleEn || values.titleHy}
          onChange={(url) =>
            setValues((current) => ({ ...current, imageUrl: url }))
          }
          onError={setErrorKey}
          stretch
        />
        <div className="flex flex-col justify-between gap-4">
          <ServiceLocalizedTitleField
            locale={contentLocale}
            values={values}
            onChange={setValues}
          />
          <ServiceSharedFields values={values} onChange={setValues} />
        </div>
        <div className="space-y-4 md:col-span-2">
          <ServiceLocalizedCopyFields
            locale={contentLocale}
            values={values}
            onChange={setValues}
          />
        </div>
      </div>
      {errorKey ? (
        <p className="text-sm text-red-700">
          {form(`errors.${errorKey}`)}
          {invalidFields.length > 0 ? ` (${invalidFields.join(", ")})` : null}
        </p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[15px] bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 ease-out hover:scale-105 disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {pending ? form("saving") : t("actions.save")}
        </button>
        <button
          type="button"
          className="rounded-[15px] border border-[var(--border)] px-5 py-2.5 text-sm transition-transform duration-200 ease-out hover:scale-105 hover:bg-[var(--surface)] motion-reduce:transition-none motion-reduce:hover:scale-100"
          onClick={onCancel}
        >
          {t("actions.cancel")}
        </button>
      </div>
      <AdminConfirmDialog
        open={confirmHide}
        message={form("confirmHide", { name: displayTitle })}
        confirmLabel={t("confirm.hide")}
        pending={pending}
        onCancel={() => setConfirmHide(false)}
        onConfirm={() => {
          setConfirmHide(false);
          submit({ close: false, visibility: "HIDDEN" });
        }}
      />
    </form>
  );
}
