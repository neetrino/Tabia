# PROGRESS — TABIA

**Վերջին թարմացում.** 2026-09-18

## Փուլեր

### Phase 0 — Onboarding & scaffold ✅
- [x] BRIEF / TECH_CARD / ARCHITECTURE
- [x] Next.js 16 + Tailwind 4 + pnpm
- [x] Prisma 7 + Neon migrate
- [x] i18n locales hy/en/ru (page JSON files)
- [x] Public page shells + Header/Footer
- [x] Admin shell (sidebar + drawer)
- [x] Admin UI i18n (hy/en/ru) + cookie locale switcher
- [x] Database session auth (ոչ JWT) + admin seed

### Phase 1 — Dynamic content (ընթացքում)
- [x] Team CRUD + forms in drawer, HY/EN/RU content switcher, drag-and-drop sort, publish switch, home-page star
- [x] Services CRUD + forms in drawer, HY/EN/RU content switcher, drag-and-drop sort, publish/hide, home-page star
- [x] News / Insights CRUD + forms in drawer, HY/EN/RU content switcher, draft/publish/deactivate, cover, publishedAt
- [x] Rich text editor (TipTap: headings, bold/italic, links, images)
- [x] R2 image upload (Team, Services, Publications)
- [x] Redis cache for published lists (TTL 10m + invalidate on write)
- [x] Contact form → Resend + rate limit
- [x] Home sections wired to DB
- [x] Detail pages (team, services, news, insights)

### Phase 2 — Polish
- [ ] Figma visual pass
- [ ] Mobile nav
- [ ] SEO metadata per page
- [ ] E2E critical flows
- [ ] Pino structured logger
- [ ] Production migrate-on-deploy job
