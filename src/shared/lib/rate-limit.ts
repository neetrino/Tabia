import "server-only";

import { logError } from "./logger";
import { getRedis } from "./redis";

type RateLimitInput = {
  key: string;
  maxAttempts: number;
  windowSeconds: number;
};

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, MemoryEntry>();

function allowMemory(input: RateLimitInput): boolean {
  const now = Date.now();
  const existing = memoryStore.get(input.key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(input.key, {
      count: 1,
      resetAt: now + input.windowSeconds * 1000,
    });
    return true;
  }

  if (existing.count >= input.maxAttempts) {
    return false;
  }

  existing.count += 1;
  return true;
}

/**
 * Fixed-window limiter. Uses Redis when configured; otherwise in-memory
 * (single instance only — production should set Upstash).
 */
export async function consumeRateLimit(
  input: RateLimitInput,
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    return allowMemory(input);
  }

  try {
    const count = await redis.incr(input.key);
    if (count === 1) {
      await redis.expire(input.key, input.windowSeconds);
    }
    return count <= input.maxAttempts;
  } catch (error) {
    logError("rate-limit", error);
    return allowMemory(input);
  }
}
