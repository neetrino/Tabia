"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { uploadTeamPhotoAction } from "../upload";
import { TeamFormField, teamInputClassName } from "./team-form-field";

type TeamPhotoFieldProps = {
  photoUrl: string | null;
  name: string;
  onChange: (url: string | null) => void;
  onError: (key: string) => void;
};

export function TeamPhotoField({
  photoUrl,
  name,
  onChange,
  onError,
}: TeamPhotoFieldProps) {
  const t = useTranslations("admin.teamForm");
  const [pending, startTransition] = useTransition();

  return (
    <TeamFormField id="photo" label={t("photo")}>
      <div className="space-y-2">
        <CoverMedia
          src={photoUrl}
          alt={name || t("photo")}
          className="aspect-[3/4] w-full rounded-[15px]"
          fallback={
            <div className="grid h-full place-items-center bg-[var(--brand)] text-lg text-white/80">
              {getInitials(name || "TM")}
            </div>
          }
        />
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className={teamInputClassName}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) {
              return;
            }

            const formData = new FormData();
            formData.set("photo", file);
            startTransition(async () => {
              const result = await uploadTeamPhotoAction(formData);
              if (result.errorKey || !result.url) {
                onError(result.errorKey ?? "uploadMissing");
                return;
              }
              onChange(result.url);
            });
          }}
        />
        {photoUrl ? (
          <button
            type="button"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            onClick={() => onChange(null)}
          >
            {t("removePhoto")}
          </button>
        ) : null}
      </div>
    </TeamFormField>
  );
}
