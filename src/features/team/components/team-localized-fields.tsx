"use client";

import { useTranslations } from "next-intl";
import { plainTextToEditorHtml } from "@/shared/ui/rich-text/plain-text";
import { RichTextEditor } from "@/shared/ui/rich-text/rich-text-editor";
import { uploadTeamPhotoAction } from "../upload";
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
  onError?: (key: string) => void;
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
  onError,
}: TeamLocalizedFieldsProps) {
  const t = useTranslations("admin.teamForm");
  const bioKey = teamLocaleField("bio", locale);
  const detailsKey = teamLocaleField("details", locale);

  return (
    <>
      <div className="md:col-span-2">
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
      </div>
      <div className="md:col-span-2">
        <TeamFormField
          id={detailsKey}
          label={t("details")}
          hint={t("detailsHint")}
        >
          <RichTextEditor
            key={detailsKey}
            id={detailsKey}
            value={plainTextToEditorHtml(String(values[detailsKey]))}
            onChange={(html) => updateLocalizedField(onChange, detailsKey, html)}
            onError={onError ?? (() => undefined)}
            uploadImage={uploadTeamDetailsImage}
          />
        </TeamFormField>
      </div>
    </>
  );
}

async function uploadTeamDetailsImage(file: File): Promise<{
  errorKey?: string;
  url?: string;
}> {
  const formData = new FormData();
  formData.set("photo", file);
  return uploadTeamPhotoAction(formData);
}
