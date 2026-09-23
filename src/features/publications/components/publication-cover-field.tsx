"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { uploadPublicationImageAction } from "../upload";
import {
  PublicationFormField,
  publicationInputClassName,
} from "./publication-form-field";

type PublicationCoverFieldProps = {
  coverUrl: string | null;
  title: string;
  onChange: (url: string | null) => void;
  onError: (key: string) => void;
};

export function PublicationCoverField({
  coverUrl,
  title,
  onChange,
  onError,
}: PublicationCoverFieldProps) {
  const t = useTranslations("admin.publicationForm");
  const [pending, startTransition] = useTransition();

  return (
    <PublicationFormField id="cover" label={t("cover")}>
      <div className="space-y-2">
        <CoverMedia
          src={coverUrl}
          alt={title || t("cover")}
          className="aspect-[16/9] w-full rounded-[15px]"
          fallback={
            <div className="grid h-full place-items-center bg-[var(--brand)] text-lg text-white/80">
              {getInitials(title || "TB")}
            </div>
          }
        />
        <input
          id="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className={publicationInputClassName}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) {
              return;
            }

            const formData = new FormData();
            formData.set("image", file);
            startTransition(async () => {
              const result = await uploadPublicationImageAction(formData);
              if (result.errorKey || !result.url) {
                onError(result.errorKey ?? "uploadMissing");
                return;
              }
              onChange(result.url);
            });
          }}
        />
        {coverUrl ? (
          <button
            type="button"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            onClick={() => onChange(null)}
          >
            {t("removeCover")}
          </button>
        ) : null}
      </div>
    </PublicationFormField>
  );
}
