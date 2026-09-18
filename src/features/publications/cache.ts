import "server-only";

import { locales, type AppLocale } from "@/i18n/routing";
import { getRedis } from "@/shared/lib/redis";
import type { PublicationPreview, PublicationTypeValue } from "./types";

type CachedPublicationPreview = Omit<PublicationPreview, "publishedAt"> & {
  publishedAt: string | null;
};

function listKey(locale: AppLocale): string {
  return `publications:published:v1:${locale}`;
}

function isCachedPreview(value: unknown): value is CachedPublicationPreview {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CachedPublicationPreview>;
  return (
    typeof item.slug === "string" &&
    (item.type === "NEWS" || item.type === "INSIGHT") &&
    typeof item.title === "string" &&
    typeof item.summary === "string" &&
    (item.coverUrl === null || typeof item.coverUrl === "string") &&
    (item.publishedAt === null || typeof item.publishedAt === "string")
  );
}

function toPreview(item: CachedPublicationPreview): PublicationPreview {
  return {
    ...item,
    publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
  };
}

export async function readPublishedPublicationsCache(
  locale: AppLocale,
): Promise<PublicationPreview[] | null> {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  const cached = await redis.get<unknown>(listKey(locale));
  if (!Array.isArray(cached) || !cached.every(isCachedPreview)) {
    return null;
  }

  return cached.map(toPreview);
}

export async function writePublishedPublicationsCache(
  locale: AppLocale,
  items: PublicationPreview[],
): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  const payload: CachedPublicationPreview[] = items.map((item) => ({
    ...item,
    publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
  }));

  await redis.set(listKey(locale), payload);
}

export async function invalidatePublicationsCache(): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  await Promise.all(locales.map((locale) => redis.del(listKey(locale))));
}

export function filterCachedPublications(
  items: PublicationPreview[],
  type?: PublicationTypeValue,
  limit?: number,
): PublicationPreview[] {
  const filtered = type ? items.filter((item) => item.type === type) : items;
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}
