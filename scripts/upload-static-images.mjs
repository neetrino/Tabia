import { readFileSync } from "node:fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const files = [
  ["public/images/home/hero-chess.webp", "static/home/hero-chess.webp"],
  ["public/images/home/about-books.webp", "static/home/about-books.webp"],
  ["public/images/home/service-scales.webp", "static/home/service-scales.webp"],
  ["public/images/home/footer-knight.webp", "static/home/footer-knight.webp"],
  ["public/images/about/scales.webp", "static/about/scales.webp"],
  ["public/images/about/practices-photo.webp", "static/about/practices-photo.webp"],
  ["public/images/about/icon-bank.webp", "static/about/icon-bank.webp"],
  ["public/images/about/icon-resources.webp", "static/about/icon-resources.webp"],
  ["public/images/about/icon-document.webp", "static/about/icon-document.webp"],
  ["public/images/about/icon-gavel.webp", "static/about/icon-gavel.webp"],
];

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const accountId = requireEnv("R2_ACCOUNT_ID");
const bucket = requireEnv("R2_BUCKET_NAME");
const publicUrl = requireEnv("R2_PUBLIC_URL").replace(/\/$/, "");

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
});

for (const [file, key] of files) {
  const body = readFileSync(file);
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  const response = await fetch(`${publicUrl}/${key}`, { method: "HEAD" });
  console.log(`${key} ${body.length} ${response.status} ${response.headers.get("content-type")}`);
}
