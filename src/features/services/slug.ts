const LATIN_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 80;

/** Returns true when the value is a lowercase Latin slug with optional hyphens. */
export function isLatinSlug(value: string): boolean {
  return LATIN_SLUG_PATTERN.test(value);
}

/** Builds a Latin slug from a source string, dropping non-ASCII characters. */
export function slugifyLatin(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH);
}
