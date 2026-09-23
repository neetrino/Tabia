"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  AdminConfirmDialog,
  AdminSortableGrip,
  AdminSortableRoot,
  moveItemById,
  useAdminSortableItem,
} from "@/features/admin/client";
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

type PendingConfirm =
  | { kind: "delete"; item: ServiceAdminItem }
  | { kind: "hide"; item: ServiceAdminItem }
  | null;

type ServiceSortableRowProps = {
  service: ServiceAdminItem;
  disabled: boolean;
  onEdit: (service: ServiceAdminItem) => void;
  onDelete: (service: ServiceAdminItem) => void;
  onTogglePublished: (service: ServiceAdminItem, published: boolean) => void;
  onToggleFeatured: (service: ServiceAdminItem, featured: boolean) => void;
};

function ServiceSortableRow({
  service,
  disabled,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}: ServiceSortableRowProps) {
  const t = useTranslations("admin");
  const { setNodeRef, style, isDragging, attributes, listeners } =
    useAdminSortableItem(service.id, disabled);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[15px] border border-[var(--border)] bg-white p-3",
        "transition-[border-color,box-shadow] duration-200 ease-out",
        "hover:border-[var(--brand)]/30 hover:shadow-sm motion-reduce:transition-none",
        isDragging && "relative z-10 cursor-grabbing bg-[var(--surface)] opacity-70 shadow-md",
        disabled && !isDragging && "opacity-70",
      )}
      onClick={() => {
        if (!disabled && !isDragging) {
          onEdit(service);
        }
      }}
    >
      <AdminSortableGrip
        label={t("reorderItemAria", { name: service.displayTitle })}
        disabled={disabled}
        attributes={attributes}
        listeners={listeners}
      />
      <ServiceAdminRow
        service={service}
        disabled={disabled}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePublished={onTogglePublished}
        onToggleFeatured={onToggleFeatured}
      />
    </li>
  );
}

export function ServiceAdminList({
  services,
  onEdit,
  onChanged,
}: ServiceAdminListProps) {
  const t = useTranslations("admin");
  const form = useTranslations("admin.serviceForm");
  const [items, setOptimisticItems] = useOptimistic(services);
  const [pending, startTransition] = useTransition();
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<PendingConfirm>(null);

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

  function reorder(activeId: string, overId: string): void {
    if (pending) {
      return;
    }
    const next = moveItemById(items, activeId, overId);
    if (
      next.length === items.length &&
      next.every((item, index) => item.id === items[index]?.id)
    ) {
      return;
    }
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

  function runConfirmedAction(): void {
    if (!confirm) {
      return;
    }
    const current = confirm;
    setConfirm(null);

    if (current.kind === "hide") {
      patchService(current.item.id, { visibility: "HIDDEN" });
      return;
    }

    startTransition(async () => {
      const result = await deleteServiceAction(current.item.id);
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
      <AdminSortableRoot
        items={items.map((item) => item.id)}
        disabled={pending}
        onReorder={reorder}
      >
        <ul className="space-y-2">
          {items.map((service) => (
            <ServiceSortableRow
              key={service.id}
              service={service}
              disabled={pending}
              onEdit={onEdit}
              onDelete={(item) => setConfirm({ kind: "delete", item })}
              onTogglePublished={(item, published) => {
                if (!published) {
                  setConfirm({ kind: "hide", item });
                  return;
                }
                patchService(item.id, { visibility: "PUBLISHED" });
              }}
              onToggleFeatured={(item, featured) =>
                patchService(item.id, { featured })
              }
            />
          ))}
        </ul>
      </AdminSortableRoot>
      <AdminConfirmDialog
        open={confirm !== null}
        message={
          confirm
            ? form(
                confirm.kind === "delete" ? "confirmDelete" : "confirmHide",
                { name: confirm.item.displayTitle },
              )
            : ""
        }
        confirmLabel={
          confirm?.kind === "delete" ? t("confirm.delete") : t("confirm.hide")
        }
        pending={pending}
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirmedAction}
      />
    </div>
  );
}
