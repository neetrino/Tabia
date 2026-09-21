"use server";

import { Prisma } from "@prisma/client";
import { getAdminSession } from "@/features/auth";
import { prisma } from "@/shared/lib/prisma";
import { invalidatePublicationsCache } from "./cache";
import { revalidatePublicationPaths } from "./revalidate";
import { publicationInputSchema, publicationStatusSchema } from "./schema";
import {
  deletePublicationMedia,
  deleteRemovedPublicationMedia,
} from "./stored-media";
import type {
  PublicationActionResult,
  PublicationRecord,
  PublicationStatusValue,
} from "./types";

function resolvePublishedAt(
  status: PublicationStatusValue,
  publishedAt: string | null,
): Date | null {
  if (status === "PUBLISHED") {
    return publishedAt ? new Date(publishedAt) : new Date();
  }

  return publishedAt ? new Date(publishedAt) : null;
}

function toWriteData(input: Omit<PublicationRecord, "id">) {
  return {
    slug: input.slug,
    type: input.type,
    status: input.status,
    coverUrl: input.coverUrl,
    titleHy: input.titleHy,
    titleEn: input.titleEn,
    titleRu: input.titleRu,
    summaryHy: input.summaryHy,
    summaryEn: input.summaryEn,
    summaryRu: input.summaryRu,
    bodyHy: input.bodyHy,
    bodyEn: input.bodyEn,
    bodyRu: input.bodyRu,
    publishedAt: resolvePublishedAt(input.status, input.publishedAt),
  };
}

export async function savePublicationAction(
  raw: unknown,
): Promise<PublicationActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const parsed = publicationInputSchema.safeParse(raw);
  if (!parsed.success) {
    const slugIssue = parsed.error.issues.find(
      (issue) => issue.message === "slugInvalid",
    );
    return { errorKey: slugIssue ? "slugInvalid" : "invalid" };
  }

  const { id, ...values } = parsed.data;
  const data = toWriteData({
    ...values,
    coverUrl: values.coverUrl ?? null,
  });

  try {
    if (id) {
      return updateExistingPublication(id, data);
    }

    await prisma.publication.create({ data });
    await invalidatePublicationsCache();
    revalidatePublicationPaths(data.type, data.slug);
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

async function updateExistingPublication(
  id: string,
  data: ReturnType<typeof toWriteData>,
): Promise<PublicationActionResult> {
  const existing = await prisma.publication.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  if (existing.type !== data.type) {
    return { errorKey: "invalid" };
  }

  await deleteRemovedPublicationMedia(existing, data);
  await prisma.publication.update({ where: { id }, data });
  await invalidatePublicationsCache();
  revalidatePublicationPaths(existing.type, existing.slug);
  revalidatePublicationPaths(data.type, data.slug);
  return { ok: true };
}

export async function deletePublicationAction(
  id: string,
): Promise<PublicationActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const existing = await prisma.publication.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  await prisma.publication.delete({ where: { id } });
  await deletePublicationMedia(existing);
  await invalidatePublicationsCache();
  revalidatePublicationPaths(existing.type, existing.slug);
  return { ok: true };
}

export async function updatePublicationStatusAction(
  raw: unknown,
): Promise<PublicationActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const parsed = publicationStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { errorKey: "invalid" };
  }

  const existing = await prisma.publication.findUnique({
    where: { id: parsed.data.id },
  });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  await prisma.publication.update({
    where: { id: existing.id },
    data: {
      status: parsed.data.status,
      publishedAt: resolvePublishedAt(
        parsed.data.status,
        existing.publishedAt?.toISOString() ?? null,
      ),
    },
  });
  await invalidatePublicationsCache();
  revalidatePublicationPaths(existing.type, existing.slug);
  return { ok: true };
}
