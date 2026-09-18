import "server-only";

import type { TeamMember } from "@prisma/client";
import { defaultLocale, locales, type AppLocale } from "@/i18n/routing";
import { prisma } from "@/shared/lib/prisma";
import {
  readPublishedTeamCache,
  writePublishedTeamCache,
} from "./cache";
import {
  toTeamMemberAdminItem,
  toTeamMemberPreview,
  toTeamMemberProfile,
} from "./map-team-member";
import type {
  TeamMemberAdminItem,
  TeamMemberPreview,
  TeamMemberProfile,
} from "./types";

function toAppLocale(locale: string): AppLocale {
  return locales.includes(locale as AppLocale) ? (locale as AppLocale) : defaultLocale;
}

const publishedOrder = [
  { sortOrder: "asc" as const },
  { createdAt: "desc" as const },
];

async function loadPublishedRows(): Promise<TeamMember[]> {
  return prisma.teamMember.findMany({
    where: { visibility: "PUBLISHED" },
    orderBy: publishedOrder,
  });
}

/** Published team members for a public locale, ordered by admin sort. */
export async function getPublishedTeamMembers(
  locale: string,
  limit?: number,
): Promise<TeamMemberPreview[]> {
  const appLocale = toAppLocale(locale);
  const cached = await readPublishedTeamCache(appLocale);
  const items = cached ?? (await loadPublishedRows()).map((row) =>
    toTeamMemberPreview(row, appLocale),
  );

  if (!cached) {
    await writePublishedTeamCache(appLocale, items);
  }

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/** Published member profile by the shared Latin slug. */
export async function getPublishedTeamMemberBySlug(
  locale: string,
  slug: string,
): Promise<TeamMemberProfile | null> {
  const row = await prisma.teamMember.findUnique({ where: { slug } });
  if (!row || row.visibility !== "PUBLISHED") {
    return null;
  }

  return toTeamMemberProfile(row, locale);
}

/** All team members for the admin list, including hidden records. */
export async function getAdminTeamMembers(
  locale: string,
): Promise<TeamMemberAdminItem[]> {
  const rows = await prisma.teamMember.findMany({
    orderBy: publishedOrder,
  });

  return rows.map((row) => toTeamMemberAdminItem(row, locale));
}

export async function getNextTeamSortOrder(): Promise<number> {
  const latest = await prisma.teamMember.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  return (latest?.sortOrder ?? 0) + 1;
}
