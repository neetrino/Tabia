"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  AdminContentLocaleSwitcher,
  AdminDrawerHeaderActions,
} from "@/features/admin/client";
import { defaultLocale, type AppLocale } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";
import { savePublicationAction } from "../actions";
import type { PublicationRecord, PublicationStatusValue } from "../types";
import { PublicationCoverField } from "./publication-cover-field";
import {
  PublicationLocalizedCopyFields,
  PublicationLocalizedTitleField,
} from "./publication-localized-fields";
import { PublicationSharedFields } from "./publication-shared-fields";

type PublicationAdminFormProps = {
  values: PublicationRecord;
  onSaved: () => void;
  onChanged?: () => void;
  onCancel: () => void;
};

export function PublicationAdminForm({
  values: initialValues,
  onSaved,
  onChanged,
  onCancel,
}: PublicationAdminFormProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.publicationForm");
  const [values, setValues] = useState(initialValues);
  const [contentLocale, setContentLocale] = useState<AppLocale>(defaultLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isActive = values.status === "PUBLISHED";

  function submit(
    status: PublicationStatusValue,
    options: { close: boolean } = { close: true },
  ): void {
    startTransition(async () => {
      const { id, ...rest } = values;
      const result = await savePublicationAction({
        ...rest,
        status,
        id: id.length > 0 ? id : undefined,
      });
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      setValues((current) => ({ ...current, status }));
      if (options.close) {
        onSaved();
        return;
      }
      onChanged?.();
    });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit("DRAFT");
      }}
    >
      {values.id ? (
        <AdminDrawerHeaderActions>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={isActive ? form("deactivate") : form("publish")}
            title={isActive ? form("deactivate") : form("publish")}
            disabled={pending}
            className={cn(
              "relative h-9 w-[3.25rem] shrink-0 rounded-[15px] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none disabled:opacity-60",
              isActive ? "bg-emerald-500" : "bg-red-500",
            )}
            onClick={() =>
              submit(isActive ? "ARCHIVED" : "PUBLISHED", { close: false })
            }
          >
            <span
              className={cn(
                "absolute top-1 size-7 rounded-[12px] bg-white shadow-sm",
                "transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "motion-reduce:transition-none",
                isActive ? "left-[1.35rem]" : "left-1",
              )}
            />
          </button>
        </AdminDrawerHeaderActions>
      ) : null}
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
          <PublicationCoverField
            coverUrl={values.coverUrl}
            title={values.titleEn || values.titleHy}
            onChange={(url) => setValues({ ...values, coverUrl: url })}
            onError={setErrorKey}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PublicationLocalizedTitleField
            locale={contentLocale}
            values={values}
            onChange={setValues}
          />
          <PublicationSharedFields values={values} onChange={setValues} />
          <div className="space-y-4 md:col-span-2">
            <PublicationLocalizedCopyFields
              locale={contentLocale}
              values={values}
              onChange={setValues}
              onError={setErrorKey}
            />
          </div>
        </div>
      </div>
      {errorKey ? (
        <p className="text-sm text-red-700">{form(`errors.${errorKey}`)}</p>
      ) : null}
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-[15px] border border-[var(--border)] px-5 py-2.5 text-sm transition-transform duration-200 ease-out hover:scale-105 hover:bg-[var(--surface)] motion-reduce:transition-none motion-reduce:hover:scale-100 disabled:opacity-60"
        >
          {pending ? form("saving") : form("saveDraft")}
        </button>
        <button
          type="button"
          className="rounded-[15px] border border-[var(--border)] px-5 py-2.5 text-sm transition-transform duration-200 ease-out hover:scale-105 hover:bg-[var(--surface)] motion-reduce:transition-none motion-reduce:hover:scale-100"
          onClick={onCancel}
        >
          {t("actions.cancel")}
        </button>
      </div>
    </form>
  );
}
