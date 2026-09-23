"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { AdminConfirmDialog } from "@/features/admin/client";
import { cn } from "@/shared/lib/cn";
import {
  deletePublicationAction,
  updatePublicationStatusAction,
} from "../actions";
import type { PublicationAdminItem, PublicationTypeValue } from "../types";
import { PublicationAdminRow } from "./publication-admin-row";

type PublicationAdminListProps = {
  type: PublicationTypeValue;
  publications: PublicationAdminItem[];
  onEdit: (publication: PublicationAdminItem) => void;
  onChanged: () => void;
};

type PendingConfirm =
  | { kind: "delete"; item: PublicationAdminItem }
  | { kind: "deactivate"; item: PublicationAdminItem }
  | null;

export function PublicationAdminList({
  type,
  publications,
  onEdit,
  onChanged,
}: PublicationAdminListProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.publicationForm");
  const [items, setOptimisticItems] = useOptimistic(publications);
  const [pending, startTransition] = useTransition();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<PendingConfirm>(null);
  const addLabel =
    type === "NEWS" ? t("resources.news.add") : t("resources.insights.add");

  function setStatus(id: string, published: boolean): void {
    const status = published ? "PUBLISHED" : "ARCHIVED";
    startTransition(async () => {
      setOptimisticItems(
        items.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      const result = await updatePublicationStatusAction({ id, status });
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      onChanged();
    });
  }

  function requestTogglePublished(
    publication: PublicationAdminItem,
    published: boolean,
  ): void {
    if (!published) {
      setConfirm({ kind: "deactivate", item: publication });
      return;
    }
    setStatus(publication.id, true);
  }

  function runConfirmedAction(): void {
    if (!confirm) {
      return;
    }

    const current = confirm;
    setConfirm(null);

    if (current.kind === "deactivate") {
      setStatus(current.item.id, false);
      return;
    }

    startTransition(async () => {
      const result = await deletePublicationAction(current.item.id);
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
        {t("empty", { addLabel })}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {errorKey ? (
        <p className="text-sm text-red-700">{form(`errors.${errorKey}`)}</p>
      ) : null}
      <ul className="space-y-2">
        {items.map((publication) => (
          <li
            key={publication.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-[15px] border border-[var(--border)] bg-white p-3",
              "transition-[border-color,box-shadow,transform] duration-200 ease-out",
              "hover:border-[var(--brand)]/30 hover:shadow-sm motion-reduce:transition-none",
              pending && "opacity-70",
            )}
            onClick={() => {
              if (!pending) {
                onEdit(publication);
              }
            }}
          >
            <PublicationAdminRow
              publication={publication}
              disabled={pending}
              onEdit={onEdit}
              onDelete={(item) => setConfirm({ kind: "delete", item })}
              onTogglePublished={requestTogglePublished}
            />
          </li>
        ))}
      </ul>
      <AdminConfirmDialog
        open={confirm !== null}
        message={
          confirm
            ? form(
                confirm.kind === "delete"
                  ? "confirmDelete"
                  : "confirmDeactivate",
                { name: confirm.item.displayTitle },
              )
            : ""
        }
        confirmLabel={
          confirm?.kind === "delete"
            ? t("confirm.delete")
            : t("confirm.deactivate")
        }
        pending={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirmedAction}
      />
    </div>
  );
}
