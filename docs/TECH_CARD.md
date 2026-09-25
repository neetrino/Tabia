# Նախագծի տեխնոլոգիական քարտ

> Լրացված է BRIEF-ի և հաճախորդի սպեցիֆիկացիայի հիման վրա։  
> **Ստատուս.** հաստատված — իրականացումը սկսված է։

**Նախագիծ.** TABIA  
**Չափ.** **B**  
**Ամսաթիվ.** 2026-09-18  
**Ստատուս.** հաստատված

> Ստատուսներ. ⬜ չի սկսվել · 🔄 ընթացքում · ✅ պատրաստ · ➖ պետք չէ

---

## 1. Հիմք

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 1.1 | Նախագծի չափ | **B** | 🔄 | Admin CMS + i18n + R2 + Redis ≈ 20–35 feature |
| 1.2 | Ճարտարապետություն | Feature-based (`src/features/*`, `src/shared/*`) | 🔄 | Size B layout |
| 1.3 | Package manager | pnpm | 🔄 | ստանդարտ |
| 1.4 | Node.js | 24.x LTS | 🔄 | |
| 1.5 | TypeScript | 5.9, strict: true | 🔄 | |
| 1.6 | Monorepo գործիք | — | ➖ | Size B — մեկ Next.js app |
| 1.7 | Git ստրատեգիա | feature branches | 🔄 | |
| 1.8 | Commit կոնվենցիա | Conventional Commits | 🔄 | |

---

## 2. Frontend

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 2.1 | Framework | Next.js 16.x (App Router) | 🔄 | fullstack |
| 2.2 | Ոճեր | Tailwind CSS 4.x | 🔄 | |
| 2.3 | UI Kit | shadcn/ui | 🔄 | admin Sidebar + Drawer |
| 2.4 | State management | useState + Server Components | 🔄 | Zustand միայն եթե պետք լինի |
| 2.5 | Ձևեր | React Hook Form + Zod + Server Actions | 🔄 | Contact + admin forms |
| 2.6 | Data fetching | Server Components + Server Actions | 🔄 | |
| 2.7 | i18n | next-intl · **hy** (default), en, ru | 🔄 | `locales/{hy,en,ru}/{page}.json` |
| 2.8 | SEO | Metadata API | 🔄 | |
| 2.9 | Մուգ թեմա | պետք չէ | ➖ | մինչև դիզայն |
| 2.10 | Անիմացիաներ | motion · scroll reveal + page enter | 🔄 | հանրային կայք; admin-ը մնում է CSS |
| 2.11 | Lazy loading | next/image lazy + content-visibility | 🔄 | hero-ն priority է; մնացածը lazy |
| 2.12 | PWA | պետք չէ | ➖ | |

---

## 3. Backend

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 3.1 | Տիպ | Next.js App Router (Server Actions) | 🔄 | առանձին NestJS չկա |
| 3.2 | Վալիդացիա | Zod | 🔄 | |
| 3.3 | API ձևաչափ | Server Actions | 🔄 | հանրային REST API չկա |
| 3.4 | Rate limiting | Server Actions + Redis | ✅ | login 5/15m, contact 5/10m |
| 3.5 | API փաստաթղթավորում | պետք չէ | ➖ | |
| 3.6 | CRON | պետք չէ | ➖ | |
| 3.7 | Ֆայլերի բեռնում | Server Actions → Cloudflare R2 | 🔄 | |

---

## 4. Բազային տվյալներ

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 4.1 | ՍՈՒԲԴ | PostgreSQL (Neon) | 🔄 | URL տրամադրված `.env`-ում |
| 4.2 | ORM | Prisma 7.x | 🔄 | |
| 4.3 | ԲԴ դերեր | app_user (հետագայում) | 🔄 | մեկնարկում Neon owner OK |
| 4.4 | Connection limit | **10** (առաջարկ) | 🔄 | հաստատել |
| 4.5 | statement_timeout | **30s** (առաջարկ) | 🔄 | հաստատել |
| 4.6 | idle_in_transaction_session_timeout | **60s** (առաջարկ) | 🔄 | հաստատել |
| 4.7 | lock_timeout | **10s** (առաջարկ) | 🔄 | հաստատել |
| 4.8 | Seed data | prisma db seed | 🔄 | admin user + demo content |
| 4.9 | Cache (Redis) | Upstash Redis | 🔄 | list cache TTL 10m + invalidate on write |
| 4.10 | Հերթեր | պետք չէ | ➖ | |
| 4.11 | Production migrations | GitHub Actions / Vercel job | 🔄 | local ≠ prod migrate |

### Մոդելներ (սկիզբ)

- `User` + `AdminSession` (custom database sessions, ոչ JWT)
- `TeamMember` (multilingual fields)
- `Service` (list + `/services/[slug]`)
- `Publication` (`type`: NEWS | INSIGHT, status, rich body, cover, publishedAt, sort)
- Media URLs → R2

i18n կոնտենտ. ստատիկ էջեր՝ JSON locales; դինամիկ entity-ներ՝ DB-ում hy/en/ru դաշտեր։

---

## 5. Ինքնություն հաստատում

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 5.1 | Լուծում | **Custom database sessions (SSS)** | ✅ | httpOnly cookie + `AdminSession` table; ոչ JWT |
| 5.2 | Մատակարարներ | Credentials (email + password) | ✅ | միայն admin |
| 5.3 | Սեսիաների ստրատեգիա | **Database sessions** — ոչ JWT | ✅ | համաձայն պահանջի |
| 5.4 | Դերեր / RBAC | ADMIN | 🔄 | մեկ դեր բավարար է |
| 5.5 | Email վերահաստատում | պետք չէ | ➖ | |
| 5.6 | Գաղտնաբառի վերականգնում | հետագա փուլ | 🔄 | |

---

## 6. Պահոց և CDN

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 6.1 | Ֆայլային պահոց | Cloudflare R2 | 🔄 | local `.env` credentials; bucket `tabia`; upload UI՝ Phase 1 |
| 6.2 | CDN | R2 public URL / Vercel | 🔄 | |
| 6.3 | Պատկերների օպտիմիզացիա | next/image | 🔄 | |

---

## 7. Արտաքին սերվիսներ

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 7.1 | Email | Resend | 🔄 | Contact → հաճախորդի email |
| 7.2 | Վճարումներ | պետք չէ | ➖ | |
| 7.3 | Անալիտիկա | պետք չէ (մեկնարկ) | ➖ | |
| 7.4 | Error tracking | Sentry (ըստ ցանկության) | 🔄 | հաստատել |
| 7.5 | Որոնում | պետք չէ | ➖ | |
| 7.6 | Push / WebSocket | պետք չէ | ➖ | |
| 7.7 | SMS | պետք չէ | ➖ | |
| 7.8 | AI | պետք չէ | ➖ | |
| 7.9 | CMS | custom admin (ոչ Sanity) | 🔄 | |
| 7.10 | Քարտեզներ | Google Maps embed (ըստ անհրաժեշտության) | 🔄 | Contact |

---

## 8. DevOps և հոսթինգ

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 8.1 | Frontend հոսթինգ | Vercel | 🔄 | |
| 8.2 | Backend հոսթինգ | — | ➖ | նույն Next.js |
| 8.3 | CI/CD | GitHub Actions | 🔄 | |
| 8.4 | Docker | պետք չէ | ➖ | |
| 8.5 | WAF | պետք չէ (մեկնարկ) | ➖ | |
| 8.6 | Մոնիտորինգ | Sentry optional | 🔄 | |
| 8.7 | Լոգավորում | Pino (prod) | 🔄 | |
| 8.8 | Շրջակա միջավայրեր | dev + prod | 🔄 | |
| 8.9 | Դոմեն | հետագայում | 🔄 | |
| 8.10 | ԲԴ բեքափներ | Neon PITR | 🔄 | |
| 8.11 | Migration job | GitHub Actions | 🔄 | |

---

## 9. Թեստավորում

| # | Պարամետր | Որոշում | Ստատուս | Նշում |
|---|----------|---------|---------|-------|
| 9.1 | Unit թեստեր | Vitest | 🔄 | domain / validation |
| 9.2 | Կոմպոնենտային | RTL (ըստ կարիքի) | 🔄 | |
| 9.3 | E2E | Playwright — critical flows | 🔄 | login, contact, publish |
| 9.4 | Ծածկույթ | ≥70% domain | 🔄 | |
| 9.5 | API թեստեր | ըստ կարիքի | 🔄 | |

---

## 10. Անվտանգություն (պարտադիր)

| # | Պարամետր | Ստատուս | Նշում |
|---|----------|---------|-------|
| 10.1 | CORS | 🔄 | նույն origin |
| 10.2 | CSRF պաշտպանություն | 🔄 | Next.js Server Actions origin check |
| 10.3 | Helmet (NestJS) | ➖ | NestJS չկա |
| 10.4 | Մուտքային տվյալների վալիդացիա | 🔄 | Zod |
| 10.5 | argon2 գաղտնաբառերի համար | 🔄 | admin password |
| 10.6 | Rate limiting | ✅ | login + contact, Redis |
| 10.7 | Env-փոփոխականներ (ոչ կոդում) | 🔄 | |

---

## 11. Նախագծի փաստաթղթավորում

| # | Փաստաթուղթ | Ստատուս | Նշում |
|---|-------------|---------|-------|
| 11.1 | docs/BRIEF.md | ✅ | |
| 11.2 | docs/TECH_CARD.md | ✅ | հաստատված |
| 11.3 | docs/01-ARCHITECTURE.md | ✅ | համընկնում է կոդին |
| 11.4 | docs/PROGRESS.md | 🔄 | Phase 1 գրեթե փակ է |
| 11.5 | Նախագծի README.md | ✅ | |
| 11.6 | .env.example | ✅ | custom sessions, R2, Redis, Resend |

---

## 12. Նախագծի եզրափակիչ ստուգում

> Լրացվում է զարգացման ավարտին։

---

## Ամփոփում

**Առաջարկված չափ.** B — Feature-based Next.js fullstack  
**Հաստատման կարիք ունեն.** DB timeouts, Figma (եթե կա)  
**Պետք չէ.** NestJS, Auth.js, JWT, monorepo, վճարումներ
