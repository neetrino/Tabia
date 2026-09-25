"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { cn } from "@/shared/lib/cn";
import type { TeamMemberAdminItem } from "../types";
import { TeamAdminSwitch } from "./team-admin-switch";

type TeamAdminMemberRowProps = {
  member: TeamMemberAdminItem;
  disabled: boolean;
  onEdit: (member: TeamMemberAdminItem) => void;
  onDelete: (member: TeamMemberAdminItem) => void;
  onTogglePublished: (member: TeamMemberAdminItem, published: boolean) => void;
  onToggleFeatured: (member: TeamMemberAdminItem, featured: boolean) => void;
};

export function TeamAdminMemberRow({
  member,
  disabled,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}: TeamAdminMemberRowProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.teamForm");

  return (
    <>
      <CoverMedia
        src={member.photoUrl}
        alt={member.displayName}
        className="size-12 shrink-0 rounded-[10px]"
        fallback={
          <div className="grid h-full place-items-center bg-[var(--brand)] text-xs text-white/80">
            {getInitials(member.displayName)}
          </div>
        }
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{member.displayName}</p>
        <p className="truncate text-sm text-[var(--muted)]">
          {member.displayPosition}
        </p>
      </div>
      <span className="hidden text-xs text-[var(--muted)] sm:inline">
        {form("orderValue", { value: member.sortOrder })}
      </span>
      <TeamAdminSwitch
        checked={member.visibility === "PUBLISHED"}
        disabled={disabled}
        label={form("published")}
        onChange={(checked) => onTogglePublished(member, checked)}
      />
      <button
        type="button"
        disabled={disabled}
        aria-pressed={member.featured}
        aria-label={form("featured")}
        className="flex size-8 items-center justify-center rounded-[15px] disabled:opacity-60"
        onClick={(event) => {
          event.stopPropagation();
          onToggleFeatured(member, !member.featured);
        }}
      >
        <Star
          className={cn(
            "size-4 transition-transform duration-200 ease-out hover:scale-110 motion-reduce:transition-none",
            member.featured
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
          onEdit(member);
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
          onDelete(member);
        }}
      >
        <Trash2 className="size-4" />
      </button>
    </>
  );
}
