"use client";

import { useTranslations } from "next-intl";
import type { ContentVisibilityValue, TeamMemberRecord } from "../types";
import { TeamFormField, teamInputClassName } from "./team-form-field";

type TeamSharedFieldsProps = {
  values: TeamMemberRecord;
  onChange: (values: TeamMemberRecord) => void;
};

export function TeamSharedFields({
  values,
  onChange,
}: TeamSharedFieldsProps) {
  const t = useTranslations("admin.teamForm");

  function update<K extends keyof TeamMemberRecord>(
    key: K,
    value: TeamMemberRecord[K],
  ): void {
    onChange({ ...values, [key]: value });
  }

  return (
    <>
      <TeamFormField id="slug" label={t("slug")}>
        <input
          id="slug"
          value={values.slug}
          autoComplete="off"
          className={teamInputClassName}
          onChange={(event) =>
            update("slug", event.target.value.trim().toLowerCase())
          }
        />
      </TeamFormField>
      <TeamFormField id="email" label={t("email")}>
        <input
          id="email"
          type="email"
          value={values.email}
          className={teamInputClassName}
          onChange={(event) => update("email", event.target.value)}
        />
      </TeamFormField>
      <TeamFormField id="phone" label={t("phone")}>
        <input
          id="phone"
          type="tel"
          value={values.phone}
          className={teamInputClassName}
          onChange={(event) => update("phone", event.target.value)}
        />
      </TeamFormField>
      <TeamFormField id="linkedInUrl" label={t("linkedIn")}>
        <input
          id="linkedInUrl"
          type="url"
          value={values.linkedInUrl}
          className={teamInputClassName}
          onChange={(event) => update("linkedInUrl", event.target.value)}
        />
      </TeamFormField>
      <TeamFormField id="sortOrder" label={t("sortOrder")}>
        <input
          id="sortOrder"
          type="number"
          min={0}
          max={9999}
          value={values.sortOrder}
          className={teamInputClassName}
          onChange={(event) =>
            update("sortOrder", Number(event.target.value) || 0)
          }
        />
      </TeamFormField>
      <TeamFormField id="visibility" label={t("visibility")}>
        <select
          id="visibility"
          value={values.visibility}
          className={teamInputClassName}
          onChange={(event) =>
            update("visibility", event.target.value as ContentVisibilityValue)
          }
        >
          <option value="PUBLISHED">{t("published")}</option>
          <option value="HIDDEN">{t("hidden")}</option>
        </select>
      </TeamFormField>
    </>
  );
}
