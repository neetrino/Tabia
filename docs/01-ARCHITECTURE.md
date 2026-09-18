# Նախագծի ճարտարապետություն. TABIA

> TABIA կորպորատիվ կայք՝ բազմալեզու հանրային էջեր + custom admin CMS։

**Նախագծի չափ.** B  
**Վերջին թարմացում.** 2026-09-18

---

## ԱՄԲՈՂՋԱԿ

### Նշանակություն
Հանրային կայք (hy/en/ru) և admin panel News, Insights, Services, Our Team կառավարման համար։

### Հիմնական առանձնահատկություններ
- Fullstack Next.js (App Router)
- i18n՝ `locales/{hy,en,ru}/*.json`, default `hy`, URL prefix always (`/hy`, `/en/about`)
- PostgreSQL + Prisma, Redis cache, R2 media
- Auth.js database sessions (ոչ JWT)

### Օգտատերեր
- **Visitor.** կարդում է էջեր, ուղարկում Contact հայտ
- **Admin.** մուտք admin panel, CRUD + publish/sort

---

## ՃԱՐՏԱՐԱՊԵՏՈՒԹՅՈՒՆ

```
┌──────────────────┐     ┌──────────────────┐
│  Public site     │     │  Admin panel     │
│  /[locale]/...    │     │  /admin/...      │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └──────────┬─────────────┘
                    ▼
         Next.js Server Actions /
         Route Handlers
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
 PostgreSQL      Upstash        Cloudflare
 (Prisma)        Redis          R2
                    │
                 Resend (contact)
```

**Ոճ.** Modular monolith (Size B feature modules)

---

## ԿՈՄՊՈՆԵՆՏՆԵՐ

| Շերտ | Տեխնոլոգիա | Տեղ |
|------|------------|-----|
| UI | Next.js 16, React 19, Tailwind 4, shadcn | `src/app`, `src/features`, `src/shared` |
| Auth | Auth.js 5, database sessions, argon2 | `src/features/auth` |
| Data | Prisma 7, PostgreSQL (Neon) | `prisma/` |
| Cache | Upstash Redis | `src/shared/lib/redis` |
| Media | R2 | `src/shared/lib/r2` |
| Email | Resend | `src/features/contact` |
| i18n | next-intl | `locales/`, `src/i18n` |

---

## ԹՂԹԱՊԱՆԱԿՆԵՐ

```
locales/
  hy|en|ru/
    common.json, home.json, about.json, team.json,
    services.json, industries.json, news.json,
    insights.json, contact.json, admin.json
prisma/
  schema.prisma
  migrations/
src/
  app/
    [locale]/          # public pages
      (site)/
    admin/             # admin (no locale prefix or /admin)
    api/auth/[...nextauth]/
  features/
    home|about|team|services|industries|
    publications|contact|admin|auth/
  shared/
    ui/                # shadcn + layout primitives
    lib/               # prisma, redis, r2, logger
    config/
  i18n/
    request.ts
    routing.ts
```

**Կանոն.** features ներմուծել միայն `@/features/x` barrel-ով։ `shared` չի ներմուծում `features`։

---

## ՏՎՅԱԼՆԵՐ

### Ստատիկ (JSON locales)
About, Industries, Contact copy, Header/Footer labels, Home static sections copy

### Դինամիկ (DB)
TeamMember, Service, Publication (NEWS | INSIGHT), AdminUser + Auth tables

### Publication status
`DRAFT` | `PUBLISHED` | `ARCHIVED`

### Multilingual DB fields
`titleHy`, `titleEn`, `titleRu` (և նույն մոդելով description/body) — պարզ և հստակ Size B-ի համար

---

## ԱՆՎՏԱՆԳՈՒԹՅՈՒՆ

- Admin routes՝ session guard (database session cookie)
- Passwords՝ argon2
- Input՝ Zod
- Rate limit՝ login + contact
- Secrets՝ env only
