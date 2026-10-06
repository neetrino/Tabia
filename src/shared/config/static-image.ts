function r2PublicBase(): string | null {
  const base = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");
  if (!base) {
    return null;
  }

  try {
    const url = new URL(base);
    if (url.protocol !== "https:" || !url.hostname) {
      return null;
    }
    return base;
  } catch {
    return null;
  }
}

/**
 * Public URL for a design image that is not managed in the admin.
 * Files live in R2 under `static/` when R2 is configured, and in `public/images` otherwise.
 */
export function staticImage(file: string): string {
  const base = r2PublicBase();
  if (!base) {
    return `/images/${file}`;
  }

  return `${base}/static/${file}`;
}
