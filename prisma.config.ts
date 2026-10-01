import "dotenv/config";
import { defineConfig } from "prisma/config";

/** Generate does not connect. A placeholder lets `prisma generate` run when Vercel has no DATABASE_URL yet. */
const FALLBACK_DATABASE_URL =
  "postgresql://127.0.0.1:5432/prisma_generate_placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || FALLBACK_DATABASE_URL,
  },
});
