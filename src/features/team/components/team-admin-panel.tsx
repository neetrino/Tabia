"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AdminDrawer } from "@/features/admin/client";
import { createEmptyTeamMember } from "../locale-fields";
import type { TeamMemberAdminItem, TeamMemberRecord } from "../types";
import { TeamAdminForm } from "./team-admin-form";
import { TeamAdminList } from "./team-admin-list";

type TeamAdminPanelProps = {
  members: TeamMemberAdminItem[];
  nextSortOrder: number;
};

function toRecord(member: TeamMemberAdminItem): TeamMemberRecord {
  return {
    id: member.id,
    slug: member.slug,
    photoUrl: member.photoUrl,
    nameHy: member.nameHy,
    nameEn: member.nameEn,
    nameRu: member.nameRu,
    positionHy: member.positionHy,
    positionEn: member.positionEn,
    positionRu: member.positionRu,
    bioHy: member.bioHy,
    bioEn: member.bioEn,
    bioRu: member.bioRu,
    detailsHy: member.detailsHy,
    detailsEn: member.detailsEn,
    detailsRu: member.detailsRu,
    email: member.email,
    phone: member.phone,
    linkedInUrl: member.linkedInUrl,
    sortOrder: member.sortOrder,
    visibility: member.visibility,
    featured: member.featured,
  };
}

export function TeamAdminPanel({
  members,
  nextSortOrder,
}: TeamAdminPanelProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<TeamMemberRecord | null>(null);

  function refresh(): void {
    setOpen(false);
    setEditing(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">{t("resources.team.title")}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("resources.team.description")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setFormKey((current) => current + 1);
            setEditing(createEmptyTeamMember(nextSortOrder));
            setOpen(true);
          }}
          className="rounded-[15px] bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition-transform duration-200 ease-out hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {t("resources.team.add")}
        </button>
      </div>
      <div className="rounded-[15px] border border-[var(--border)] bg-white p-4 shadow-sm">
        <TeamAdminList
          members={members}
          onEdit={(member) => {
            setEditing(toRecord(member));
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
            ? t("resources.team.editTitle")
            : t("resources.team.drawerTitle")
        }
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        {editing ? (
          <TeamAdminForm
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
