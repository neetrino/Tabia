import type { z } from "zod";

export const LOCALE_REQUIRED_MESSAGE = "localeRequired";

/**
 * Zod `superRefine` callback: each group of per-locale keys (e.g. `titleHy`,
 * `titleEn`, `titleRu`) must have a non-empty value in at least one locale.
 */
export function requireAnyLocale<T extends Record<string, unknown>>(
  groups: ReadonlyArray<ReadonlyArray<keyof T & string>>,
) {
  return (value: T, ctx: z.RefinementCtx<T>): void => {
    for (const group of groups) {
      const filled = group.some((key) => {
        const field = value[key];
        return typeof field === "string" && field.trim().length > 0;
      });
      if (filled) {
        continue;
      }
      for (const key of group) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: LOCALE_REQUIRED_MESSAGE,
        });
      }
    }
  };
}
