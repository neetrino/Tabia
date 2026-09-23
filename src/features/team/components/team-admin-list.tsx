"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import {
  deleteTeamMemberAction,
  reorderTeamMembersAction,
  updateTeamMemberFlagsAction,
} from "../actions";
import type { TeamMemberAdminItem } from "../types";
import { TeamAdminMemberRow } from "./team-admin-member-row";

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

  function patchMember(
    id: string,
    patch: Partial<Pick<TeamMemberAdminItem, "visibility" | "featured">>,
  ): void {
    startTransition(async () => {
      setOptimisticItems(
        items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      const result = await updateTeamMemberFlagsAction({ id, ...patch });
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      onChanged();
    });
  }

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
              "flex items-center gap-3 rounded-[15px] border border-[var(--border)] bg-white p-3",
              "transition-[border-color,box-shadow,transform] duration-200 ease-out",
              "hover:border-[var(--brand)]/30 hover:shadow-sm motion-reduce:transition-none",
              pending && "opacity-70",
            )}
          >
            <span className="cursor-grab text-[var(--muted)]" aria-hidden>
              <GripVertical className="size-4" />
            </span>
            <TeamAdminMemberRow
              member={member}
              disabled={pending}
              onEdit={onEdit}
              onDelete={remove}
              onTogglePublished={(item, published) =>
                patchMember(item.id, {
                  visibility: published ? "PUBLISHED" : "HIDDEN",
                })
              }
              onToggleFeatured={(item, featured) =>
                patchMember(item.id, { featured })
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
