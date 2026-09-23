"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminDrawer } from "@/features/admin/client";
import { createEmptyPublication } from "../locale-fields";
import type {
  PublicationAdminItem,
  PublicationRecord,
  PublicationTypeValue,
} from "../types";
import { PublicationAdminForm } from "./publication-admin-form";
import { PublicationAdminList } from "./publication-admin-list";

type PublicationAdminPanelProps = {
  type: PublicationTypeValue;
  publications: PublicationAdminItem[];
};

function toRecord(publication: PublicationAdminItem): PublicationRecord {
  return {
    id: publication.id,
    slug: publication.slug,
    type: publication.type,
    status: publication.status,
    coverUrl: publication.coverUrl,
    titleHy: publication.titleHy,
    titleEn: publication.titleEn,
    titleRu: publication.titleRu,
    summaryHy: publication.summaryHy,
    summaryEn: publication.summaryEn,
    summaryRu: publication.summaryRu,
    bodyHy: publication.bodyHy,
    bodyEn: publication.bodyEn,
    bodyRu: publication.bodyRu,
    publishedAt: publication.publishedAt,
  };
}

export function PublicationAdminPanel({
  type,
  publications,
}: PublicationAdminPanelProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<PublicationRecord | null>(null);
  const resource = type === "NEWS" ? "news" : "insights";

  function refresh(): void {
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">{t(`resources.${resource}.title`)}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t(`resources.${resource}.description`)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormKey((current) => current + 1);
            setEditing(createEmptyPublication(type));
            setOpen(true);
          }}
          className="rounded-[15px] bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {t(`resources.${resource}.add`)}
        </button>
      </div>
      <div className="rounded-[15px] border border-[var(--border)] bg-white p-4 shadow-sm">
        <PublicationAdminList
          type={type}
          publications={publications}
          onEdit={(publication) => {
            setEditing(toRecord(publication));
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
            ? t(`resources.${resource}.editTitle`)
            : t(`resources.${resource}.drawerTitle`)
        }
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        {editing ? (
          <PublicationAdminForm
            key={editing.id || `new-${formKey}`}
            values={editing}
            onSaved={refresh}
            onChanged={() => router.refresh()}
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
