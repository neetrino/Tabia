const IMAGE_SRC_PATTERN = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

/** Collects unique image URLs from HTML fragments. */
export function extractHtmlImageUrls(...htmlParts: string[]): string[] {
  const urls = new Set<string>();

  for (const html of htmlParts) {
    for (const match of html.matchAll(IMAGE_SRC_PATTERN)) {
      const src = match[1];
      if (src) {
        urls.add(src);
      }
    }
  }

  return [...urls];
}
