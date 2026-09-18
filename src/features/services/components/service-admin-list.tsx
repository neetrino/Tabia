"use client";

import { useOptimistic, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { GripVertical } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import {
  deleteServiceAction,
  reorderServicesAction,
  updateServiceFlagsAction,
} from "../actions";
import type { ServiceAdminItem } from "../types";
import { ServiceAdminRow } from "./service-admin-row";

type ServiceAdminListProps = {
  services: ServiceAdminItem[];
  onEdit: (service: ServiceAdminItem) => void;
  onChanged: () => void;
};

export function ServiceAdminList({
  services,
  onEdit,
  onChanged,
}: ServiceAdminListProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.serviceForm");
  const [items, setOptimisticItems] = useOptimistic(services);
  const dragIndex = useRef<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [errorKey, setErrorKey] = useState<string | null>(null);

  function patchService(
    id: string,
    patch: Partial<Pick<ServiceAdminItem, "visibility" | "featured">>,
  ): void {
    startTransition(async () => {
      setOptimisticItems(
        items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
      const result = await updateServiceFlagsAction({ id, ...patch });
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
      const result = await reorderServicesAction(ordered.map((item) => item.id));
      if (result.errorKey) {
        setErrorKey(result.errorKey);
        return;
      }
      onChanged();
    });
  }

  function remove(service: ServiceAdminItem): void {
    if (!window.confirm(form("confirmDelete", { name: service.displayTitle }))) {
      return;
    }

    startTransition(async () => {
      const result = await deleteServiceAction(service.id);
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
        {t("empty", { addLabel: t("resources.services.add") })}
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
        {items.map((service, index) => (
          <li
            key={service.id}
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
            <ServiceAdminRow
              service={service}
              disabled={pending}
              onEdit={onEdit}
              onDelete={remove}
              onTogglePublished={(item, published) =>
                patchService(item.id, {
                  visibility: published ? "PUBLISHED" : "HIDDEN",
                })
              }
              onToggleFeatured={(item, featured) =>
                patchService(item.id, { featured })
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
