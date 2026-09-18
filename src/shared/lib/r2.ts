import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const R2_CACHE_CONTROL = "public, max-age=31536000, immutable";

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
};

type R2ObjectInput = {
  key: string;
  body: Uint8Array;
  contentType: string;
};

const globalForR2 = globalThis as unknown as {
  r2Client: S3Client | undefined;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

function getR2Config(): R2Config {
  return {
    accountId: requireEnv("R2_ACCOUNT_ID"),
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    bucket: requireEnv("R2_BUCKET_NAME"),
    publicUrl: requireEnv("R2_PUBLIC_URL").replace(/\/$/, ""),
  };
}

function getR2Client(): S3Client {
  if (globalForR2.r2Client) {
    return globalForR2.r2Client;
  }

  const { accountId, accessKeyId, secretAccessKey } = getR2Config();
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForR2.r2Client = client;
  }

  return client;
}

/** Returns true when all R2 env vars are present. */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim() &&
      process.env.R2_PUBLIC_URL?.trim(),
  );
}

/** Public HTTPS URL for an object key in the configured bucket. */
export function getR2PublicUrl(key: string): string {
  const { publicUrl } = getR2Config();
  return `${publicUrl}/${key.replace(/^\//, "")}`;
}

/** Uploads an object and returns its public URL. */
export async function uploadR2Object(input: R2ObjectInput): Promise<string> {
  const { bucket } = getR2Config();

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: R2_CACHE_CONTROL,
    }),
  );

  return getR2PublicUrl(input.key);
}

/** Deletes an object by key. Missing objects are treated as success. */
export async function deleteR2Object(key: string): Promise<void> {
  const { bucket } = getR2Config();

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
