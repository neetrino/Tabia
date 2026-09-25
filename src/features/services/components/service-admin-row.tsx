"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { cn } from "@/shared/lib/cn";
import type { ServiceAdminItem } from "../types";
import { ServiceAdminSwitch } from "./service-admin-switch";

type ServiceAdminRowProps = {
  service: ServiceAdminItem;
  disabled: boolean;
  onEdit: (service: ServiceAdminItem) => void;
  onDelete: (service: ServiceAdminItem) => void;
  onTogglePublished: (service: ServiceAdminItem, published: boolean) => void;
  onToggleFeatured: (service: ServiceAdminItem, featured: boolean) => void;
};

export function ServiceAdminRow({
  service,
  disabled,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}: ServiceAdminRowProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.serviceForm");

  return (
    <>
      <CoverMedia
        src={service.imageUrl}
        alt={service.displayTitle}
        className="size-12 shrink-0 rounded-[10px]"
        fallback={
          <div className="grid h-full place-items-center bg-[var(--brand)] text-xs text-white/80">
            {getInitials(service.displayTitle)}
          </div>
        }
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{service.displayTitle}</p>
        <p className="truncate text-sm text-[var(--muted)]">
          {service.displaySummary}
        </p>
      </div>
      <span className="hidden text-xs text-[var(--muted)] sm:inline">
        {form("orderValue", { value: service.sortOrder })}
      </span>
      <ServiceAdminSwitch
        checked={service.visibility === "PUBLISHED"}
        disabled={disabled}
        label={form("published")}
        onChange={(checked) => onTogglePublished(service, checked)}
      />
      <button
        type="button"
        disabled={disabled}
        aria-pressed={service.featured}
        aria-label={form("featured")}
        className="flex size-8 items-center justify-center rounded-[15px] disabled:opacity-60"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFeatured(service, !service.featured);
        }}
      >
        <Star
          className={cn(
            "size-4 transition-transform duration-200 ease-out hover:scale-110 motion-reduce:transition-none",
            service.featured
              ? "fill-blue-600 text-blue-600"
              : "text-[var(--muted)]",
          )}
        />
      </button>
      <button
        type="button"
        aria-label={t("actions.edit")}
        className="flex size-8 items-center justify-center rounded-[15px] text-[var(--brand)] transition-transform duration-200 ease-out hover:scale-105 hover:bg-[var(--surface)] motion-reduce:transition-none motion-reduce:hover:scale-100"
        onClick={(event) => {
          event.stopPropagation();
          onEdit(service);
        }}
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        aria-label={t("actions.delete")}
        className="flex size-8 items-center justify-center rounded-[15px] text-red-700 transition-transform duration-200 ease-out hover:scale-105 hover:bg-[var(--surface)] motion-reduce:transition-none motion-reduce:hover:scale-100"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(service);
        }}
      >
        <Trash2 className="size-4" />
      </button>
    </>
  );
}
