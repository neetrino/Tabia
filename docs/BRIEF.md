# Նախագծի տեխզադրանք — TABIA

> Լրացված է հաճախորդի տեխնիկական սպեցիֆիկացիայից (TABIA × NEETRINO)։

---

## Նկարագրություն

TABIA-ի պաշտոնական կորպորատիվ կայք՝ բազմալեզու (hy / en / ru) հանրային էջերով և առանձին admin panel-ով։  
Հանրային կայքը ներկայացնում է կազմակերպությունը, ծառայությունները, թիմը, ոլորտները, նորություններն ու վերլուծությունները։  
Admin-ը կառավարում է միայն News, Insights, Services և Our Team բաժինները։

## Թիրախային լսարան

- Հաճախորդներ և գործընկերներ՝ ծառայությունների և կոնտակտի համար
- Իրավաբանական / խորհրդատվական լսարան՝ Insights և News
- Ներքին ադմին՝ կոնտենտի հրապարակման համար

## Հիմնական ֆունկցիաներ (առաջնայնացված)

1. Բազմալեզու հանրային կայք (hy առաջնային, en, ru) + ընդհանուր Header/Footer — բարձր
2. Home, About, Our Team, Services, Industries & Practices, News, Insights, Contact էջեր — բարձր
3. Admin panel (News, Insights, Services, Team)՝ CRUD, draft/publish, հերթականություն, R2 նկարներ — բարձր
4. Contact հայտի ձև → email ուղարկում — բարձր
5. Redis cache դինամիկ ցուցակների համար — միջին
6. News/Insights մանրամասն էջեր + rich text — բարձր
7. SEO (Metadata) — միջին

## Stack (որոշված)

- **Տարբերակ A** — fullstack Next.js (App Router)
- PostgreSQL (Neon)
- Server-side sessions (ոչ JWT) — custom `AdminSession` + httpOnly cookie
- Redis cache (Upstash)
- Cloudflare R2 — նկարներ
- i18n՝ `locales/{hy,en,ru}/*.json` (էջային ֆայլեր՝ home.json, about.json, …)

## Դիզայն

- Figma. դեռ չի տրամադրվել
- UI Kit / դիզայն-համակարգ. կառուցվում է նախագծում (Tailwind + shadcn/ui)

## Ինտեգրացիաներ

- [ ] Վճարային համակարգ — ոչ
- [x] Email (Resend) — Contact հայտեր
- [x] Աուտենտիֆիկացիա — custom database sessions (ոչ JWT, ոչ Auth.js)
- [x] Ֆայլերի պահոց — Cloudflare R2
- [x] Redis — Upstash
- [ ] Արտաքին API — ոչ (քարտեզ՝ ըստ անհրաժեշտության)

## Կոնտենտի լեզու

- Ինտերֆեյսի հիմնական լեզու. **hy**
- Ինտերնացիոնալացում (i18n). **այո** — hy, en, ru

## Սահմանափակումներ

- Ժամկետներ. առանց դեդլայնի (մեկնարկ՝ անմիջապես հաստատումից հետո)
- Ստատիկ էջեր (admin-ից չեն կառավարվում). About, Industries & Practices, Contact բովանդակություն, Header/Footer ստատիկ մասեր
- Admin-ից կառավարվում է միայն. News, Insights, Services, Our Team

## Էջեր և բովանդակություն

### Հանրային

| Էջ | Նշում |
|----|--------|
| Home | Hero, About preview, Services (սահմանափակ), Industries, Team preview, News & Insights, Footer |
| About | Պատմություն, առաքելություն, տեսլական, արժեքներ, սկզբունքներ — ստատիկ |
| Our Team | Քարտեր + optional detail; հերթականություն admin-ից |
| Services | Բոլոր ծառայություններ + detail; publish/hide, sort |
| Industries & Practices | Ստատիկ ոլորտներ |
| News / Insights | Ցուցակ + detail URL; admin CRUD + rich text |
| Contact | Ստատիկ կոնտակտներ + հայտի ձև → email |

### Admin

- Sidebar նավիգացիա
- Create/Edit՝ կողային Drawer
- Rich text խմբագրիչ (վերնագրեր, bold/italic, հղումներ, նկարներ)

## Լրացուցիչ

- Responsive. mobile / tablet / laptop / desktop
- Header և Footer՝ բոլոր հանրային էջերում նույնը
- Root-ում `locales/` կառուցվածք՝ hy, en, ru → էջային JSON ֆայլեր
