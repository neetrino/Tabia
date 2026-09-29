/**
 * Public URL for a design image that is not managed in the admin.
 * Files live in R2 under `static/` when R2 is configured, and in `public/images` otherwise.
 */
export function staticImage(file: string): string {
  const base = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");
  if (!base) {
    return `/images/${file}`;
  }

  return `${base}/static/${file}`;
}
