import "server-only";

import { locales, type AppLocale } from "@/i18n/routing";
import { PUBLISHED_LIST_CACHE_TTL_SECONDS } from "@/shared/config/limits";
import { getRedis } from "@/shared/lib/redis";
import type { ServicePreview } from "./types";

function listKey(locale: AppLocale): string {
  return `services:published:v2:${locale}`;
}

function isPreview(value: unknown): value is ServicePreview {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<ServicePreview>;
  return (
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.summary === "string" &&
    (item.imageUrl === null || typeof item.imageUrl === "string")
  );
}

export async function readPublishedServicesCache(
  locale: AppLocale,
): Promise<ServicePreview[] | null> {
  const redis = getRedis();
  if (!redis) {
    return null;
  }

  const cached = await redis.get<unknown>(listKey(locale));
  if (!Array.isArray(cached) || !cached.every(isPreview)) {
    return null;
  }

  return cached;
}

export async function writePublishedServicesCache(
  locale: AppLocale,
  items: ServicePreview[],
): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  await redis.set(listKey(locale), items, {
    ex: PUBLISHED_LIST_CACHE_TTL_SECONDS,
  });
}

export async function invalidateServicesCache(): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  await Promise.all(locales.map((locale) => redis.del(listKey(locale))));
}
