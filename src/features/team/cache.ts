import "server-only";

import { locales, type AppLocale } from "@/i18n/routing";
import { PUBLISHED_LIST_CACHE_TTL_SECONDS } from "@/shared/config/limits";
import { getRedis } from "@/shared/lib/redis";
import type { TeamMemberPreview } from "./types";

function listKey(locale: AppLocale): string {
  return `team:published:v3:${locale}`;
}

function isPreview(value: unknown): value is TeamMemberPreview {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<TeamMemberPreview>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.position === "string" &&
    typeof item.bio === "string" &&
    typeof item.hasProfile === "boolean"
  );
}

export async function readPublishedTeamCache(
  locale: AppLocale,
): Promise<TeamMemberPreview[] | null> {
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

export async function writePublishedTeamCache(
  locale: AppLocale,
  items: TeamMemberPreview[],
): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  await redis.set(listKey(locale), items, {
    ex: PUBLISHED_LIST_CACHE_TTL_SECONDS,
  });
}

export async function invalidateTeamCache(): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    return;
  }

  await Promise.all(locales.map((locale) => redis.del(listKey(locale))));
}
