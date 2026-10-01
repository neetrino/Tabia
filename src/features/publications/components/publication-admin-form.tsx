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
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const isActive = values.status === "PUBLISHED";
  const displayTitle =
    values.titleEn.trim() ||
    values.titleHy.trim() ||
    values.titleRu.trim() ||
    values.slug;

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
        setInvalidFields(result.invalidFields ?? []);
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

  function handleStatusToggle(): void {
    if (isActive) {
      setConfirmDeactivate(true);
      return;
    }
    submit("PUBLISHED", { close: false });
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        submit(values.status || "DRAFT");
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
              "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:transition-none disabled:opacity-60",
              isActive ? "bg-emerald-500" : "bg-red-500",
            )}
            onClick={handleStatusToggle}
          >
            <span
              className={cn(
                "absolute top-0.5 size-6 rounded-full bg-white",
                "transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "motion-reduce:transition-none",
                isActive ? "left-[1.375rem]" : "left-0.5",
              )}
            />
          </button>
        </AdminDrawerHeaderActions>
      ) : null}
      <AdminContentLocaleSwitcher
        value={contentLocale}
        onChange={setContentLocale}
        label={form("contentLocale")}
      />
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex w-48 shrink-0 flex-col gap-4">
            <PublicationCoverField
              coverUrl={values.coverUrl}
              title={values.titleEn || values.titleHy}
              onChange={(url) =>
                setValues((current) => ({ ...current, coverUrl: url }))
              }
              onError={setErrorKey}
            />
            <PublicationCoverField
              fieldId="body-image"
              coverUrl={values.bodyImageUrl}
              title={values.titleEn || values.titleHy}
              label={form("bodyImage")}
              removeLabel={form("removeBodyImage")}
              onChange={(url) =>
                setValues((current) => ({ ...current, bodyImageUrl: url }))
              }
              onError={setErrorKey}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <PublicationLocalizedTitleField
              locale={contentLocale}
              values={values}
              onChange={setValues}
            />
            <PublicationSharedFields values={values} onChange={setValues} />
          </div>
        </div>
        <PublicationLocalizedCopyFields
          locale={contentLocale}
          values={values}
          onChange={setValues}
          onError={setErrorKey}
        />
      </div>
      {errorKey ? (
        <p className="text-sm text-red-700">
          {form(`errors.${errorKey}`)}
          {invalidFields.length > 0
            ? ` (${invalidFields
                .map((field) => {
                  const key = `errors.invalidFields.${field}` as const;
                  return form.has(key) ? form(key) : field;
                })
                .join(", ")})`
            : null}
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
        open={confirmDeactivate}
        message={form("confirmDeactivate", { name: displayTitle })}
        confirmLabel={t("confirm.deactivate")}
        pending={pending}
        onCancel={() => setConfirmDeactivate(false)}
        onConfirm={() => {
          setConfirmDeactivate(false);
          submit("ARCHIVED", { close: false });
        }}
      />
    </form>
  );
}
