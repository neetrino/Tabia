# TABIA

Corporate website + admin CMS for TABIA (hy / en / ru).

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS 4
- PostgreSQL (Neon) + Prisma 7
- Database sessions (httpOnly cookie, no JWT)
- next-intl (`locales/{hy,en,ru}/*.json`)
- Redis (Upstash), R2, Resend — wired next

## Setup

```bash
pnpm install
cp .env.example .env   # then fill secrets
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Admin seed credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`

## Docs

- `docs/BRIEF.md`
- `docs/TECH_CARD.md`
- `docs/01-ARCHITECTURE.md`
- `docs/PROGRESS.md`
