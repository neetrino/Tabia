"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
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

  function remove(publication: PublicationAdminItem): void {
    if (!window.confirm(form("confirmDelete", { name: publication.displayTitle }))) {
      return;
    }

    startTransition(async () => {
      const result = await deletePublicationAction(publication.id);
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
              "flex items-center gap-3 rounded-[15px] border border-[var(--border)] bg-white p-3",
              "transition-[border-color,box-shadow,transform] duration-200 ease-out",
              "hover:border-[var(--brand)]/30 hover:shadow-sm motion-reduce:transition-none",
              pending && "opacity-70",
            )}
          >
            <PublicationAdminRow
              publication={publication}
              disabled={pending}
              onEdit={onEdit}
              onDelete={remove}
              onTogglePublished={(item, published) =>
                setStatus(item.id, published)
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
