export const MAX_UPLOAD_IMAGE_BYTES = 5 * 1024 * 1024;

export type AllowedImageMime = "image/jpeg" | "image/png" | "image/webp";

const MIME_EXTENSION: Record<AllowedImageMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Detects JPEG, PNG, or WebP from magic bytes. */
export function detectImageMime(bytes: Uint8Array): AllowedImageMime | null {
  if (bytes.length < 12) {
    return null;
  }

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }

  const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  if (riff === "RIFF" && webp === "WEBP") {
    return "image/webp";
  }

  return null;
}

export function extensionForImageMime(mime: AllowedImageMime): string {
  return MIME_EXTENSION[mime];
}
