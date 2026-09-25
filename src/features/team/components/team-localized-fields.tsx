"use client";

import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { teamLocaleField } from "../locale-fields";
import { slugifyLatin } from "../slug";
import type { TeamMemberRecord } from "../types";
import {
  TeamFormField,
  teamInputClassName,
  teamTextAreaClassName,
} from "./team-form-field";

type TeamValuesChange = (
  update: TeamMemberRecord | ((current: TeamMemberRecord) => TeamMemberRecord),
) => void;

type TeamLocalizedFieldsProps = {
  locale: AppLocale;
  values: TeamMemberRecord;
  onChange: TeamValuesChange;
};

function updateLocalizedField(
  onChange: TeamValuesChange,
  key: keyof TeamMemberRecord,
  value: string,
): void {
  onChange((current) => {
    const next = { ...current, [key]: value };
    if (
      key === "nameEn" &&
      (!current.slug || current.slug === slugifyLatin(current.nameEn))
    ) {
      const generated = slugifyLatin(value);
      if (generated) {
        next.slug = generated;
      }
    }
    return next;
  });
}

export function TeamLocalizedIdentityFields({
  locale,
  values,
  onChange,
}: TeamLocalizedFieldsProps) {
  const t = useTranslations("admin.teamForm");
  const nameKey = teamLocaleField("name", locale);
  const positionKey = teamLocaleField("position", locale);

  return (
    <>
      <TeamFormField id={nameKey} label={t("name")}>
        <input
          id={nameKey}
          value={String(values[nameKey])}
          className={teamInputClassName}
          onChange={(event) =>
            updateLocalizedField(onChange, nameKey, event.target.value)
          }
        />
      </TeamFormField>
      <TeamFormField id={positionKey} label={t("position")}>
        <input
          id={positionKey}
          value={String(values[positionKey])}
          className={teamInputClassName}
          onChange={(event) =>
            updateLocalizedField(onChange, positionKey, event.target.value)
          }
        />
      </TeamFormField>
    </>
  );
}

export function TeamLocalizedBioFields({
  locale,
  values,
  onChange,
}: TeamLocalizedFieldsProps) {
  const t = useTranslations("admin.teamForm");
  const bioKey = teamLocaleField("bio", locale);
  const detailsKey = teamLocaleField("details", locale);

  return (
    <>
      <TeamFormField id={bioKey} label={t("bio")} hint={t("bioHint")}>
        <textarea
          id={bioKey}
          value={String(values[bioKey])}
          className={teamTextAreaClassName("min-h-32")}
          onChange={(event) =>
            updateLocalizedField(onChange, bioKey, event.target.value)
          }
        />
      </TeamFormField>
      <TeamFormField
        id={detailsKey}
        label={t("details")}
        hint={t("detailsHint")}
      >
        <textarea
          id={detailsKey}
          value={String(values[detailsKey])}
          className={teamTextAreaClassName("min-h-32")}
          onChange={(event) =>
            updateLocalizedField(onChange, detailsKey, event.target.value)
          }
        />
      </TeamFormField>
    </>
  );
}
