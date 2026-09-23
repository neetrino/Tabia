import type { ZodError } from "zod";

/** Unique field paths from a Zod error, e.g. `bioRu`, `titleEn`. */
export function zodInvalidFields(error: ZodError): string[] {
  const fields = error.issues
    .map((issue) => issue.path.filter((part) => typeof part === "string").join("."))
    .filter((path) => path.length > 0);

  return [...new Set(fields)];
}
