"use server";

import { randomUUID } from "node:crypto";
import { getAdminSession } from "@/features/auth";
import {
  detectImageMime,
  extensionForImageMime,
  MAX_UPLOAD_IMAGE_BYTES,
} from "@/shared/lib/image";
import { isR2Configured, uploadR2Object } from "@/shared/lib/r2";
import type { PublicationActionResult } from "./types";

export type PublicationImageUploadResult = PublicationActionResult & {
  url?: string;
};

export async function uploadPublicationImageAction(
  formData: FormData,
): Promise<PublicationImageUploadResult> {
  const session = await getAdminSession();
  if (!session) {
    return { errorKey: "unauthorized" };
  }

  if (!isR2Configured()) {
    return { errorKey: "storageUnavailable" };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { errorKey: "uploadMissing" };
  }

  if (file.size > MAX_UPLOAD_IMAGE_BYTES) {
    return { errorKey: "uploadTooLarge" };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = detectImageMime(bytes);
  if (!mime) {
    return { errorKey: "uploadType" };
  }

  const key = `publications/${randomUUID()}.${extensionForImageMime(mime)}`;
  const url = await uploadR2Object({
    key,
    body: bytes,
    contentType: mime,
  });

  return { ok: true, url };
}
