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
import { saveTeamMemberAction } from "../actions";
import type { ContentVisibilityValue, TeamMemberRecord } from "../types";
import { TeamPhotoField } from "./team-photo-field";
import {
  TeamLocalizedBioFields,
  TeamLocalizedIdentityFields,
} from "./team-localized-fields";
import { TeamSharedFields } from "./team-shared-fields";

type TeamAdminFormProps = {
  values: TeamMemberRecord;
  onSaved: () => void;
  onChanged?: () => void;
  onCancel: () => void;
};

export function TeamAdminForm({
  values: initialValues,
  onSaved,
  onChanged,
  onCancel,
}: TeamAdminFormProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.teamForm");
  const [values, setValues] = useState(initialValues);
  const [contentLocale, setContentLocale] = useState<AppLocale>(defaultLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [confirmHide, setConfirmHide] = useState(false);

  const isPublished = values.visibility === "PUBLISHED";
  const displayName =
    values.nameHy.trim() ||
    values.nameEn.trim() ||
    values.nameRu.trim() ||
    values.slug;

  function submit(
    options: { close: boolean; visibility?: ContentVisibilityValue } = {
      close: true,
    },
  ): void {
    startTransition(async () => {
      const { id, ...rest } = values;
      const visibility = options.visibility ?? values.visibility;
      const result = await saveTeamMemberAction({
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
        <TeamSheetSwitch
          published={isPublished}
          pending={pending}
          label={isPublished ? form("hidden") : form("published")}
          onToggle={() =>
            handleVisibilityChange(isPublished ? "HIDDEN" : "PUBLISHED")
          }
        />
      </AdminDrawerHeaderActions>
      <AdminContentLocaleSwitcher
        value={contentLocale}
        onChange={setContentLocale}
        label={form("contentLocale")}
      />
      <div className="grid gap-6">
        <div className="max-w-44">
          <TeamPhotoField
            photoUrl={values.photoUrl}
            name={values.nameEn || values.nameHy}
            onChange={(url) =>
              setValues((current) => ({ ...current, photoUrl: url }))
            }
            onError={setErrorKey}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TeamLocalizedIdentityFields
            locale={contentLocale}
            values={values}
            onChange={setValues}
          />
          <TeamSharedFields
            values={values}
            onChange={setValues}
          />
          <TeamLocalizedBioFields
            locale={contentLocale}
            values={values}
            onChange={setValues}
            onError={setErrorKey}
          />
        </div>
      </div>
      {errorKey ? (
        <p className="text-sm text-red-700">
          {form(`errors.${errorKey}`)}
          {invalidFields.length > 0 ? ` (${invalidFields.join(", ")})` : null}
        </p>
      ) : null}
      <div className="flex justify-end gap-3">
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
        message={form("confirmHide", { name: displayName })}
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

function TeamSheetSwitch({
  published,
  pending,
  label,
  onToggle,
}: {
  published: boolean;
  pending: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={published}
      aria-label={label}
      title={label}
      disabled={pending}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "motion-reduce:transition-none disabled:opacity-60",
        published ? "bg-emerald-500" : "bg-red-500",
      )}
      onClick={onToggle}
    >
      <span
        className={cn(
          "absolute top-0.5 size-6 rounded-full bg-white",
          "transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-reduce:transition-none",
          published ? "left-[1.375rem]" : "left-0.5",
        )}
      />
    </button>
  );
}
