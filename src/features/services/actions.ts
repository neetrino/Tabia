"use server";

import { Prisma } from "@prisma/client";
import { getAdminSession } from "@/features/auth/session";
import { prisma } from "@/shared/lib/prisma";
import { deleteR2Object } from "@/shared/lib/r2";
import { r2KeyFromPublicUrl } from "@/shared/lib/r2-key";
import { invalidateServicesCache } from "./cache";
import { revalidateServicePaths } from "./revalidate";
import { serviceFlagsSchema, serviceInputSchema } from "./schema";
import type { ServiceActionResult, ServiceRecord } from "./types";

async function deleteStoredImage(url: string | null): Promise<void> {
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

function toWriteData(input: Omit<ServiceRecord, "id">) {
  return {
    slug: input.slug,
    imageUrl: input.imageUrl,
    titleHy: input.titleHy,
    titleEn: input.titleEn,
    titleRu: input.titleRu,
    summaryHy: input.summaryHy,
    summaryEn: input.summaryEn,
    summaryRu: input.summaryRu,
    bodyHy: input.bodyHy,
    bodyEn: input.bodyEn,
    bodyRu: input.bodyRu,
    sortOrder: input.sortOrder,
    visibility: input.visibility,
    featured: input.featured,
  };
}

export async function saveServiceAction(
  raw: unknown,
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const parsed = serviceInputSchema.safeParse(raw);
  if (!parsed.success) {
    const slugIssue = parsed.error.issues.find(
      (issue) => issue.message === "slugInvalid",
    );
    return { errorKey: slugIssue ? "slugInvalid" : "invalid" };
  }

  const { id, ...values } = parsed.data;
  const data = toWriteData({
    ...values,
    imageUrl: values.imageUrl ?? null,
  });

  try {
    if (id) {
      return updateExistingService(id, data);
    }

    await prisma.service.create({ data });
    await invalidateServicesCache();
    revalidateServicePaths(data.slug);
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

async function updateExistingService(
  id: string,
  data: ReturnType<typeof toWriteData>,
): Promise<ServiceActionResult> {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  if (existing.imageUrl && existing.imageUrl !== data.imageUrl) {
    await deleteStoredImage(existing.imageUrl);
  }

  await prisma.service.update({ where: { id }, data });
  await invalidateServicesCache();
  revalidateServicePaths(existing.slug);
  revalidateServicePaths(data.slug);
  return { ok: true };
}

export async function deleteServiceAction(
  id: string,
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  await prisma.service.delete({ where: { id } });
  await deleteStoredImage(existing.imageUrl);
  await invalidateServicesCache();
  revalidateServicePaths(existing.slug);
  return { ok: true };
}

export async function reorderServicesAction(
  ids: string[],
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string")) {
    return { errorKey: "invalid" };
  }

  const uniqueIds = new Set(ids);
  const count = await prisma.service.count();
  if (uniqueIds.size !== ids.length || ids.length !== count) {
    return { errorKey: "invalid" };
  }

  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.service.update({
        where: { id },
        data: { sortOrder: index + 1 },
      }),
    ),
  );

  await invalidateServicesCache();
  revalidateServicePaths();
  return { ok: true };
}

export async function updateServiceFlagsAction(
  raw: unknown,
): Promise<ServiceActionResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  const parsed = serviceFlagsSchema.safeParse(raw);
  if (!parsed.success) {
    return { errorKey: "invalid" };
  }

  const { id, visibility, featured } = parsed.data;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return { errorKey: "notFound" };
  }

  await prisma.service.update({
    where: { id },
    data: {
      ...(visibility ? { visibility } : {}),
      ...(typeof featured === "boolean" ? { featured } : {}),
    },
  });
  await invalidateServicesCache();
  revalidateServicePaths(existing.slug);
  return { ok: true };
}
