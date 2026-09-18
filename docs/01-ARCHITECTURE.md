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
- Custom database sessions (`AdminSession` + httpOnly cookie, ոչ JWT, ոչ Auth.js)

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
         Server Components + Server Actions
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
| Auth | Custom DB sessions, argon2 | `src/features/auth` |
| Data | Prisma 7, PostgreSQL (Neon) | `prisma/` |
| Cache / rate limit | Upstash Redis | `src/shared/lib/redis`, `src/shared/lib/rate-limit` |
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
    [locale]/                 # public pages (thin)
    admin/
      login/                  # unauthenticated
      (protected)/            # session required in layout
  features/
    site|home|team|services|publications|
    contact|admin|auth/
  shared/
    ui/
    lib/                      # prisma, redis, r2, rate-limit
    config/
  i18n/
    request.ts
    routing.ts
```

About և Industries ստատիկ JSON էջեր են՝ `app/[locale]/…` մեջ, առանձին feature չեն։

**Public API**
- Server՝ `@/features/x`
- Client-safe actions/UI՝ `@/features/x/client` (`auth`, `admin`)
- `shared` չի ներմուծում `features`

**Cross-feature (explicit)**
- `home` → `team`, `services`, `publications`
- `team` / `services` / `publications` → `admin/client` (CMS chrome)
- admin shell + CMS mutations → `auth`

---

## ՏՎՅԱԼՆԵՐ

### Ստատիկ (JSON locales)
About, Industries, Contact copy, Header/Footer labels, Home static sections copy

### Դինամիկ (DB)
`User` + `AdminSession`, TeamMember (visibility + featured-on-home), Service (visibility + featured-on-home), Publication (NEWS | INSIGHT)

### Publication status
`DRAFT` | `PUBLISHED` | `ARCHIVED`

### Publication body
Sanitized HTML — TipTap in admin (headings, bold/italic, links, images, lists); public pages render after sanitization.

### Multilingual DB fields
`titleHy`, `titleEn`, `titleRu` (և նույն մոդելով description/body) — պարզ և հստակ Size B-ի համար

---

## ԱՆՎՏԱՆԳՈՒԹՅՈՒՆ

- Admin protected group՝ մեկ session guard layout-ում
- Passwords՝ argon2
- Input՝ Zod
- CSRF՝ Next.js Server Actions origin check
- Rate limit (Redis, fallback՝ in-memory)՝ login 5 / 15 րոպե, contact 5 / 10 րոպե
- Published list cache TTL՝ 10 րոպե (mutations նաև invalidate են անում)
- Secrets՝ env only
