/** Safety-net TTL for published list caches. Mutations already invalidate. */
export const PUBLISHED_LIST_CACHE_TTL_SECONDS = 10 * 60;

export const LOGIN_RATE_LIMIT = {
  maxAttempts: 5,
  windowSeconds: 15 * 60,
} as const;

export const CONTACT_RATE_LIMIT = {
  maxAttempts: 5,
  windowSeconds: 10 * 60,
} as const;
