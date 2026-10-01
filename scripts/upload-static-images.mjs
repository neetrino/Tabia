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
  ["public/images/about/hero-knight.webp", "static/about/hero-knight.webp"],
  ["public/images/about/hero-knight-side.webp", "static/about/hero-knight-side.webp"],
  ["public/images/about/hero-knight-full.webp", "static/about/hero-knight-full.webp"],
  ["public/images/about/hero-knight-edge.webp", "static/about/hero-knight-edge.webp"],
  ["public/images/about/intro-queen.webp", "static/about/intro-queen.webp"],
  ["public/images/about/intro-queen-side.webp", "static/about/intro-queen-side.webp"],
  ["public/images/about/experience-towers.webp", "static/about/experience-towers.webp"],
  ["public/images/about/work-01.webp", "static/about/work-01.webp"],
  ["public/images/about/work-02.webp", "static/about/work-02.webp"],
  ["public/images/about/work-03.webp", "static/about/work-03.webp"],
  ["public/images/about/why-chess.webp", "static/about/why-chess.webp"],
  ["public/images/about/why-board.webp", "static/about/why-board.webp"],
  ["public/images/about/why-board-side.webp", "static/about/why-board-side.webp"],
  ["public/images/about/people-hand.webp", "static/about/people-hand.webp"],
  ["public/images/about/people-kings.webp", "static/about/people-kings.webp"],
  ["public/images/about/people-kings-side.webp", "static/about/people-kings-side.webp"],
  ["public/images/about/people-kings-figma.webp", "static/about/people-kings-figma.webp"],
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
