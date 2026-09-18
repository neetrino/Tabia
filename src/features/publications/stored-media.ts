import { deleteR2Object } from "@/shared/lib/r2";
import { r2KeyFromPublicUrl } from "@/shared/lib/r2-key";
import { extractHtmlImageUrls } from "./html-media";

type PublicationMediaSource = {
  coverUrl: string | null;
  bodyHy: string;
  bodyEn: string;
  bodyRu: string;
};

async function deleteStoredImage(url: string): Promise<void> {
  const key = r2KeyFromPublicUrl(url);
  if (!key) {
    return;
  }

  try {
    await deleteR2Object(key);
  } catch {
    return;
  }
}

export function collectPublicationMediaUrls(
  source: PublicationMediaSource,
): Set<string> {
  const urls = new Set<string>();
  if (source.coverUrl) {
    urls.add(source.coverUrl);
  }

  for (const url of extractHtmlImageUrls(
    source.bodyHy,
    source.bodyEn,
    source.bodyRu,
  )) {
    urls.add(url);
  }

  return urls;
}

export async function deletePublicationMedia(
  source: PublicationMediaSource,
): Promise<void> {
  const urls = collectPublicationMediaUrls(source);
  await Promise.all([...urls].map((url) => deleteStoredImage(url)));
}

export async function deleteRemovedPublicationMedia(
  previous: PublicationMediaSource,
  next: PublicationMediaSource,
): Promise<void> {
  const nextUrls = collectPublicationMediaUrls(next);
  const removed = [...collectPublicationMediaUrls(previous)].filter(
    (url) => !nextUrls.has(url),
  );
  await Promise.all(removed.map((url) => deleteStoredImage(url)));
}
