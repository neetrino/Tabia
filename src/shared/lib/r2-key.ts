/** Returns the object key when `url` is hosted on the configured R2 public origin. */
export function r2KeyFromPublicUrl(url: string): string | null {
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");
  if (!publicUrl || !url.startsWith(`${publicUrl}/`)) {
    return null;
  }

  const key = url.slice(publicUrl.length + 1);
  return key.length > 0 ? key : null;
}
