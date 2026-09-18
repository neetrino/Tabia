"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { uploadServiceImageAction } from "../upload";
import { ServiceFormField, serviceInputClassName } from "./service-form-field";

type ServiceImageFieldProps = {
  imageUrl: string | null;
  title: string;
  onChange: (url: string | null) => void;
  onError: (key: string) => void;
};

export function ServiceImageField({
  imageUrl,
  title,
  onChange,
  onError,
}: ServiceImageFieldProps) {
  const t = useTranslations("admin.serviceForm");
  const [pending, startTransition] = useTransition();

  return (
    <ServiceFormField id="image" label={t("image")}>
      <div className="space-y-2">
        <CoverMedia
          src={imageUrl}
          alt={title || t("image")}
          className="aspect-[16/9] w-full rounded-xl"
          fallback={
            <div className="grid h-full place-items-center bg-[var(--brand)] text-lg text-white/80">
              {getInitials(title || "SV")}
            </div>
          }
        />
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className={serviceInputClassName}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) {
              return;
            }

            const formData = new FormData();
            formData.set("image", file);
            startTransition(async () => {
              const result = await uploadServiceImageAction(formData);
              if (result.errorKey || !result.url) {
                onError(result.errorKey ?? "uploadMissing");
                return;
              }
              onChange(result.url);
            });
          }}
        />
        {imageUrl ? (
          <button
            type="button"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
            onClick={() => onChange(null)}
          >
            {t("removeImage")}
          </button>
        ) : null}
      </div>
    </ServiceFormField>
  );
}
