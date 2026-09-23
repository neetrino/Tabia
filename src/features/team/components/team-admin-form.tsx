"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { AdminContentLocaleSwitcher } from "@/features/admin/client";
import { defaultLocale, type AppLocale } from "@/i18n/routing";
import { saveTeamMemberAction } from "../actions";
import type { TeamMemberRecord } from "../types";
import { TeamPhotoField } from "./team-photo-field";
import {
  TeamLocalizedBioFields,
  TeamLocalizedIdentityFields,
} from "./team-localized-fields";
import { TeamSharedFields } from "./team-shared-fields";

type TeamAdminFormProps = {
  values: TeamMemberRecord;
  onSaved: () => void;
  onCancel: () => void;
};

export function TeamAdminForm({
  values: initialValues,
  onSaved,
  onCancel,
}: TeamAdminFormProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.teamForm");
  const [values, setValues] = useState(initialValues);
  const [contentLocale, setContentLocale] = useState<AppLocale>(defaultLocale);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(): void {
    startTransition(async () => {
      const { id, ...rest } = values;
      const result = await saveTeamMemberAction({
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
        <div className="max-w-44">
          <TeamPhotoField
            photoUrl={values.photoUrl}
            name={values.nameEn || values.nameHy}
            onChange={(url) => setValues({ ...values, photoUrl: url })}
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
          />
        </div>
      </div>
      {errorKey ? (
        <p className="text-sm text-red-700">{form(`errors.${errorKey}`)}</p>
      ) : null}
      <div className="flex gap-3">
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
    </form>
  );
}
