"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { cn } from "@/shared/lib/cn";
import type { PublicationAdminItem, PublicationStatusValue } from "../types";
import { PublicationAdminSwitch } from "./publication-admin-switch";

type PublicationAdminRowProps = {
  publication: PublicationAdminItem;
  disabled: boolean;
  onEdit: (publication: PublicationAdminItem) => void;
  onDelete: (publication: PublicationAdminItem) => void;
  onTogglePublished: (
    publication: PublicationAdminItem,
    published: boolean,
  ) => void;
};

const STATUS_CLASSNAME: Record<PublicationStatusValue, string> = {
  DRAFT: "bg-[var(--surface)] text-[var(--muted)]",
  PUBLISHED: "bg-[var(--brand-soft)] text-[var(--brand)]",
  ARCHIVED: "bg-[var(--surface)] text-[var(--muted-strong)]",
};

export function PublicationAdminRow({
  publication,
  disabled,
  onEdit,
  onDelete,
  onTogglePublished,
}: PublicationAdminRowProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.publicationForm");

  return (
    <>
      <CoverMedia
        src={publication.coverUrl}
        alt={publication.displayTitle}
        className="size-12 shrink-0 rounded-md"
        fallback={
          <div className="grid h-full place-items-center bg-[var(--brand)] text-xs text-white/80">
            {getInitials(publication.displayTitle)}
          </div>
        }
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{publication.displayTitle}</p>
        <p className="truncate text-sm text-[var(--muted)]">
          {publication.displaySummary}
        </p>
      </div>
      <span
        className={cn(
          "hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline",
          STATUS_CLASSNAME[publication.status],
        )}
      >
        {form(`status.${publication.status}`)}
      </span>
      {publication.displayDate ? (
        <span className="hidden text-xs text-[var(--muted)] lg:inline">
          {publication.displayDate}
        </span>
      ) : null}
      <PublicationAdminSwitch
        checked={publication.status === "PUBLISHED"}
        disabled={disabled}
        label={form("publish")}
        onChange={(checked) => onTogglePublished(publication, checked)}
      />
      <button
        type="button"
        aria-label={t("actions.edit")}
        className="rounded-md p-1 text-[var(--brand)] hover:bg-[var(--surface)]"
        onClick={() => onEdit(publication)}
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        aria-label={t("actions.delete")}
        className="rounded-md p-1 text-red-700 hover:bg-[var(--surface)]"
        onClick={() => onDelete(publication)}
      >
        <Trash2 className="size-4" />
      </button>
    </>
  );
}
