import "server-only";

import { Redis } from "@upstash/redis";

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | undefined;
};

/** Returns the Upstash client, or null when Redis env vars are missing. */
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  if (!globalForRedis.redisClient) {
    globalForRedis.redisClient = new Redis({ url, token });
  }

  return globalForRedis.redisClient;
}
