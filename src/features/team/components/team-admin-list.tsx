"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { GripVertical } from "lucide-react";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getInitials } from "@/shared/lib/localized";
import { cn } from "@/shared/lib/cn";
import {
  deleteTeamMemberAction,
  reorderTeamMembersAction,
} from "../actions";
import type { TeamMemberAdminItem } from "../types";

type TeamAdminListProps = {
  members: TeamMemberAdminItem[];
  onEdit: (member: TeamMemberAdminItem) => void;
  onChanged: () => void;
};

export function TeamAdminList({
  members,
  onEdit,
  onChanged,
}: TeamAdminListProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.teamForm");
  const [items, setOptimisticItems] = useOptimistic(members);
  const dragIndex = useRef<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [errorKey, setErrorKey] = useState<string | null>(null);

  function move(from: number, to: number): void {
    if (from === to) {
      return;
    }

    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (!moved) {
      return;
    }
    next.splice(to, 0, moved);
    const ordered = next.map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
    startTransition(async () => {
      setOptimisticItems(ordered);
      const result = await reorderTeamMembersAction(
        ordered.map((item) => item.id),
      );
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      onChanged();
    });
  }

  function remove(member: TeamMemberAdminItem): void {
    if (!window.confirm(form("confirmDelete", { name: member.displayName }))) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTeamMemberAction(member.id);
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      onChanged();
    });
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]">
        {t("empty", { addLabel: t("resources.team.add") })}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted)]">{form("dragHint")}</p>
      {errorKey ? (
        <p className="text-sm text-red-700">{form(`errors.${errorKey}`)}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((member, index) => (
          <li
            key={member.id}
            draggable
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              const from = dragIndex.current;
              dragIndex.current = null;
              if (from === null) {
                return;
              }
              move(from, index);
            }}
            className={cn(
              "flex items-center gap-3 rounded-md border border-[var(--border)] bg-white p-3",
              pending && "opacity-70",
            )}
          >
            <span className="cursor-grab text-[var(--muted)]" aria-hidden>
              <GripVertical className="size-4" />
            </span>
            <CoverMedia
              src={member.photoUrl}
              alt={member.displayName}
              className="size-12 shrink-0 rounded-md"
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
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">
              {member.visibility === "PUBLISHED"
                ? form("published")
                : form("hidden")}
            </span>
            <button
              type="button"
              className="text-sm text-[var(--brand)]"
              onClick={() => onEdit(member)}
            >
              {t("actions.edit")}
            </button>
            <button
              type="button"
              className="text-sm text-red-700"
              onClick={() => remove(member)}
            >
              {t("actions.delete")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
