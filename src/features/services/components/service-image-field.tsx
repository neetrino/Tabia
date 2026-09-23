"use client";

import { useRef, useTransition } from "react";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { uploadServiceImageAction } from "../upload";
import { ServiceFormField } from "./service-form-field";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <ServiceFormField id="image" label={t("image")}>
      <div className="relative overflow-hidden rounded-[15px]">
        <button
          type="button"
          disabled={pending}
          aria-label={t("image")}
          className="group relative block w-full overflow-hidden rounded-[15px] text-left transition duration-200 hover:opacity-95 disabled:opacity-60"
          onClick={() => {
            if (!pending) {
              inputRef.current?.click();
            }
          }}
        >
          <CoverMedia
            src={imageUrl}
            alt={title || t("image")}
            className="aspect-[16/9] w-full rounded-[15px]"
            fallback={
              <div className="grid h-full place-items-center bg-[var(--brand)] text-lg text-white/80">
                {getInitials(title || "SV")}
              </div>
            }
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/35">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-[var(--brand)] opacity-0 shadow-sm transition group-hover:opacity-100">
              <ImagePlus className="size-5" aria-hidden />
            </span>
          </span>
        </button>
        {imageUrl ? (
          <button
            type="button"
            aria-label={t("removeImage")}
            title={t("removeImage")}
            className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
            onClick={() => onChange(null)}
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
        <input
          ref={inputRef}
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className="sr-only"
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
      </div>
    </ServiceFormField>
  );
}
