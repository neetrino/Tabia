"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminDrawer } from "@/features/admin/client";
import { createEmptyService } from "../locale-fields";
import type { ServiceAdminItem, ServiceRecord } from "../types";
import { ServiceAdminForm } from "./service-admin-form";
import { ServiceAdminList } from "./service-admin-list";

type ServiceAdminPanelProps = {
  services: ServiceAdminItem[];
  nextSortOrder: number;
};

function toRecord(service: ServiceAdminItem): ServiceRecord {
  return {
    id: service.id,
    slug: service.slug,
    imageUrl: service.imageUrl,
    titleHy: service.titleHy,
    titleEn: service.titleEn,
    titleRu: service.titleRu,
    summaryHy: service.summaryHy,
    summaryEn: service.summaryEn,
    summaryRu: service.summaryRu,
    bodyHy: service.bodyHy,
    bodyEn: service.bodyEn,
    bodyRu: service.bodyRu,
    sortOrder: service.sortOrder,
    visibility: service.visibility,
    featured: service.featured,
  };
}

export function ServiceAdminPanel({
  services,
  nextSortOrder,
}: ServiceAdminPanelProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<ServiceRecord | null>(null);

  function refresh(): void {
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">{t("resources.services.title")}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("resources.services.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormKey((current) => current + 1);
            setEditing(createEmptyService(nextSortOrder));
            setOpen(true);
          }}
          className="rounded-[15px] bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {t("resources.services.add")}
        </button>
      </div>
      <div className="rounded-[15px] border border-[var(--border)] bg-white p-4 shadow-sm">
        <ServiceAdminList
          services={services}
          onEdit={(service) => {
            setEditing(toRecord(service));
            setOpen(true);
          }}
          onChanged={() => router.refresh()}
        />
      </div>
      <AdminDrawer
        open={open}
        size="wide"
        title={
          editing?.id
            ? t("resources.services.editTitle")
            : t("resources.services.drawerTitle")
        }
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        {editing ? (
          <ServiceAdminForm
            key={editing.id || `new-${formKey}`}
            values={editing}
            onSaved={refresh}
            onCancel={() => {
              setOpen(false);
              setEditing(null);
            }}
          />
        ) : null}
      </AdminDrawer>
    </div>
  );
}
