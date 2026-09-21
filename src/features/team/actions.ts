"use server";

import { Prisma } from "@prisma/client";
import { getAdminSession } from "@/features/auth";
import { prisma } from "@/shared/lib/prisma";
import { deleteR2Object } from "@/shared/lib/r2";
import { r2KeyFromPublicUrl } from "@/shared/lib/r2-key";
import { invalidateTeamCache } from "./cache";
import { optionalDbText } from "./map-team-member";
import { revalidateTeamPaths } from "./revalidate";
import { teamMemberFlagsSchema, teamMemberInputSchema } from "./schema";
import type { TeamActionResult, TeamMemberRecord } from "./types";

async function deleteStoredPhoto(url: string | null): Promise<void> {
  if (!url) {
    return;
  }

  const key = r2KeyFromPublicUrl(url);
  if (!key) {
    return;
  }

  try {
    await deleteR2Object(key);
  } catch {
    return;
  }
}

function toWriteData(input: Omit<TeamMemberRecord, "id">) {
  return {
    slug: input.slug,
    photoUrl: input.photoUrl,
    nameHy: input.nameHy,
    nameEn: input.nameEn,
    nameRu: input.nameRu,
    positionHy: input.positionHy,
    positionEn: input.positionEn,
    positionRu: input.positionRu,
    bioHy: input.bioHy,
    bioEn: input.bioEn,
    bioRu: input.bioRu,
    detailsHy: optionalDbText(input.detailsHy),
    detailsEn: optionalDbText(input.detailsEn),
    detailsRu: optionalDbText(input.detailsRu),
    email: optionalDbText(input.email),
    phone: optionalDbText(input.phone),
    linkedInUrl: optionalDbText(input.linkedInUrl),
    sortOrder: input.sortOrder,
    visibility: input.visibility,
    featured: input.featured,
  };
}

export async function saveTeamMemberAction(
  raw: unknown,
): Promise<TeamActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const parsed = teamMemberInputSchema.safeParse(raw);
  if (!parsed.success) {
    const slugIssue = parsed.error.issues.find(
      (issue) => issue.message === "slugInvalid",
    );
    return { errorKey: slugIssue ? "slugInvalid" : "invalid" };
  }

  const { id, ...values } = parsed.data;
  const data = toWriteData({
    ...values,
    photoUrl: values.photoUrl ?? null,
  });

  try {
    if (id) {
      const existing = await prisma.teamMember.findUnique({ where: { id } });
      if (!existing) {
        return { errorKey: "notFound" };
      }

      if (existing.photoUrl && existing.photoUrl !== data.photoUrl) {
        await deleteStoredPhoto(existing.photoUrl);
      }

      await prisma.teamMember.update({ where: { id }, data });
      await invalidateTeamCache();
      revalidateTeamPaths(existing.slug);
      revalidateTeamPaths(data.slug);
      return { ok: true };
    }

    await prisma.teamMember.create({ data });
    await invalidateTeamCache();
    revalidateTeamPaths(data.slug);
    return { ok: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { errorKey: "slugTaken" };
    }

    throw error;
  }
}

export async function deleteTeamMemberAction(
  id: string,
): Promise<TeamActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  await prisma.teamMember.delete({ where: { id } });
  await deleteStoredPhoto(existing.photoUrl);
  await invalidateTeamCache();
  revalidateTeamPaths(existing.slug);
  return { ok: true };
}

export async function reorderTeamMembersAction(
  ids: string[],
): Promise<TeamActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string")) {
    return { errorKey: "invalid" };
  }

  const uniqueIds = new Set(ids);
  const count = await prisma.teamMember.count();
  if (uniqueIds.size !== ids.length || ids.length !== count) {
    return { errorKey: "invalid" };
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.teamMember.update({
        where: { id },
        data: { sortOrder: index + 1 },
      }),
    ),
  );

  await invalidateTeamCache();
  revalidateTeamPaths();
  return { ok: true };
}

export async function updateTeamMemberFlagsAction(
  raw: unknown,
): Promise<TeamActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const parsed = teamMemberFlagsSchema.safeParse(raw);
  if (!parsed.success) {
    return { errorKey: "invalid" };
  }

  const { id, visibility, featured } = parsed.data;
  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  await prisma.teamMember.update({
    where: { id },
    data: {
      ...(visibility ? { visibility } : {}),
      ...(typeof featured === "boolean" ? { featured } : {}),
    },
  });
  await invalidateTeamCache();
  revalidateTeamPaths(existing.slug);
  return { ok: true };
}
