import "dotenv/config";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seed");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const services = [
  {
    slug: "corporate-advisory",
    imageUrl: "/images/industries/corporate.svg",
    sortOrder: 1,
    titleHy: "Կորպորատիվ խորհրդատվություն",
    titleEn: "Corporate advisory",
    titleRu: "Корпоративное консультирование",
    summaryHy: "Ընկերության կառուցվածք, կառավարում և գործարքների իրավական աջակցություն։",
    summaryEn: "Company structure, governance, and legal support for transactions.",
    summaryRu: "Структура компании, управление и правовая поддержка сделок.",
    bodyHy: "Աջակցում ենք կորպորատիվ որոշումներին՝ սկսած հիմնադրումից մինչև վերակազմակերպում։",
    bodyEn: "We support corporate decisions from formation through reorganization.",
    bodyRu: "Поддерживаем корпоративные решения от создания до реорганизации.",
  },
  {
    slug: "employment-advisory",
    imageUrl: "/images/industries/employment.svg",
    sortOrder: 2,
    titleHy: "Աշխատանքային իրավունք",
    titleEn: "Employment law",
    titleRu: "Трудовое право",
    summaryHy: "Աշխատանքային հարաբերություններ, ներքին կանոնակարգեր և ռիսկերի կառավարում։",
    summaryEn: "Employment relations, internal policies, and risk management.",
    summaryRu: "Трудовые отношения, внутренние политики и управление рисками.",
    bodyHy: "Օգնում ենք կառուցել համապատասխան և թափանցիկ աշխատանքային գործընթացներ։",
    bodyEn: "We help build compliant and transparent employment processes.",
    bodyRu: "Помогаем выстроить прозрачные и соответствующие трудовые процессы.",
  },
  {
    slug: "tax-advisory",
    imageUrl: "/images/industries/tax.svg",
    sortOrder: 3,
    titleHy: "Հարկային խորհրդատվություն",
    titleEn: "Tax advisory",
    titleRu: "Налоговое консультирование",
    summaryHy: "Հարկային պլանավորում և համապատասխանություն գործարար որոշումներում։",
    summaryEn: "Tax planning and compliance in business decisions.",
    summaryRu: "Налоговое планирование и соответствие в бизнес-решениях.",
    bodyHy: "Վերլուծում ենք հարկային հետևանքները և առաջարկում գործնական լուծումներ։",
    bodyEn: "We analyze tax implications and propose practical solutions.",
    bodyRu: "Анализируем налоговые последствия и предлагаем практические решения.",
  },
  {
    slug: "dispute-resolution",
    imageUrl: "/images/industries/disputes.svg",
    sortOrder: 4,
    titleHy: "Վեճերի լուծում",
    titleEn: "Dispute resolution",
    titleRu: "Разрешение споров",
    summaryHy: "Ներկայացուցչություն և բանակցային լուծումներ բիզնես վեճերում։",
    summaryEn: "Representation and negotiated outcomes in business disputes.",
    summaryRu: "Представительство и переговорные решения в бизнес-спорах.",
    bodyHy: "Աշխատում ենք նախ բանակցային լուծման, ապա՝ պաշտպանության ուղղությամբ։",
    bodyEn: "We start with negotiated resolution, then representation if needed.",
    bodyRu: "Сначала ищем переговорное решение, затем — представительство.",
  },
];

const team = [
  {
    slug: "ani-sargsyan",
    sortOrder: 1,
    email: "ani.sargsyan@tabia.am",
    phone: "+374 10 000 001",
    linkedInUrl: "https://www.linkedin.com/",
    nameHy: "Անի Սարգսյան",
    nameEn: "Ani Sargsyan",
    nameRu: "Ани Саргсян",
    positionHy: "Գործընկեր",
    positionEn: "Partner",
    positionRu: "Партнер",
    bioHy: "Կորպորատիվ իրավունքի և գործարքների մասնագետ։",
    bioEn: "Specialist in corporate law and transactions.",
    bioRu: "Специалист по корпоративному праву и сделкам.",
    detailsHy:
      "Անին ուղեկցում է կորպորատիվ գործարքներն ու կառավարման փոփոխությունները՝ սկսած կառուցվածքից մինչև փաստաթղթավորում։ Աշխատում է հայկական և միջազգային հաճախորդների հետ։",
    detailsEn:
      "Ani advises on corporate transactions and governance changes, from structure through documentation. She works with Armenian and international clients.",
    detailsRu:
      "Ани сопровождает корпоративные сделки и изменения в управлении — от структуры до документации. Работает с армянскими и международными клиентами.",
  },
  {
    slug: "armen-hakobyan",
    sortOrder: 2,
    email: "armen.hakobyan@tabia.am",
    phone: "+374 10 000 002",
    nameHy: "Արմեն Հակոբյան",
    nameEn: "Armen Hakobyan",
    nameRu: "Армен Акопян",
    positionHy: "Ավագ խորհրդատու",
    positionEn: "Senior advisor",
    positionRu: "Старший консультант",
    bioHy: "Աշխատանքային իրավունք և կազմակերպչական համապատասխանություն։",
    bioEn: "Employment law and organizational compliance.",
    bioRu: "Трудовое право и организационное соответствие.",
    detailsHy:
      "Արմենը կառուցում է աշխատանքային գործընթացներ և ներքին կանոնակարգեր, որոնք նվազեցնում են վեճերի ռիսկը և պաշտպանում գործատուին ու աշխատակցին։",
    detailsEn:
      "Armen designs employment processes and internal policies that reduce dispute risk and protect both employers and employees.",
    detailsRu:
      "Армен выстраивает трудовые процессы и внутренние политики, которые снижают риск споров и защищают работодателя и сотрудника.",
  },
  {
    slug: "lilit-petrosyan",
    sortOrder: 3,
    email: "lilit.petrosyan@tabia.am",
    nameHy: "Լիլիթ Պետրոսյան",
    nameEn: "Lilit Petrosyan",
    nameRu: "Лилит Петросян",
    positionHy: "Հարկային խորհրդատու",
    positionEn: "Tax advisor",
    positionRu: "Налоговый консультант",
    bioHy: "Հարկային պլանավորում և համապատասխանության վերլուծություն։",
    bioEn: "Tax planning and compliance analysis.",
    bioRu: "Налоговое планирование и анализ соответствия.",
  },
  {
    slug: "narek-avetyan",
    sortOrder: 4,
    phone: "+374 10 000 004",
    nameHy: "Նարեկ Ավետյան",
    nameEn: "Narek Avetyan",
    nameRu: "Нарек Аветян",
    positionHy: "Իրավաբան",
    positionEn: "Counsel",
    positionRu: "Юрист",
    bioHy: "Վեճերի լուծում և բանակցային ներկայացուցչություն։",
    bioEn: "Dispute resolution and negotiated representation.",
    bioRu: "Разрешение споров и переговорное представительство.",
  },
];

const publications = [
  {
    slug: "office-opening",
    type: "NEWS" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/industries/corporate.svg",
    publishedAt: new Date("2026-09-01"),
    titleHy: "TABIA-ն մեկնարկում է նոր փուլ",
    titleEn: "TABIA begins a new chapter",
    titleRu: "TABIA начинает новый этап",
    summaryHy: "Կազմակերպությունը ներկայացնում է թարմացված ծառայություններ և թիմ։",
    summaryEn: "The firm presents an updated service offering and team.",
    summaryRu: "Компания представляет обновленные услуги и команду.",
    bodyHy: "Մենք շարունակում ենք զարգացնել մասնագիտական աջակցությունը բիզնես հաճախորդների համար։",
    bodyEn: "We continue to grow professional support for business clients.",
    bodyRu: "Мы продолжаем развивать профессиональную поддержку бизнес-клиентов.",
  },
  {
    slug: "employment-updates",
    type: "INSIGHT" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/industries/employment.svg",
    publishedAt: new Date("2026-08-20"),
    titleHy: "Աշխատանքային իրավունքի գործնական նշումներ",
    titleEn: "Practical notes on employment law",
    titleRu: "Практические заметки по трудовому праву",
    summaryHy: "Ինչպես կառուցել ներքին կանոնակարգեր՝ առանց ավելորդ ռիսկի։",
    summaryEn: "How to build internal policies without unnecessary risk.",
    summaryRu: "Как выстроить внутренние политики без лишнего риска.",
    bodyHy: "Հստակ փաստաթղթավորումը նվազեցնում է վեճերի հավանականությունը և պաշտպանում երկու կողմերին։",
    bodyEn: "Clear documentation reduces disputes and protects both sides.",
    bodyRu: "Четкая документация снижает риск споров и защищает обе стороны.",
  },
  {
    slug: "tax-planning-note",
    type: "INSIGHT" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/industries/tax.svg",
    publishedAt: new Date("2026-08-05"),
    titleHy: "Հարկային պլանավորումը գործարքից առաջ",
    titleEn: "Tax planning before the transaction",
    titleRu: "Налоговое планирование до сделки",
    summaryHy: "Գործարքի կառուցվածքը պետք է գնահատվի նաև հարկային տեսանկյունից։",
    summaryEn: "Deal structure should also be assessed from a tax perspective.",
    summaryRu: "Структуру сделки нужно оценивать и с налоговой точки зрения.",
    bodyHy: "Վաղ վերլուծությունը օգնում է խուսափել թանկ հետևանքներից։",
    bodyEn: "Early analysis helps avoid costly consequences.",
    bodyRu: "Ранний анализ помогает избежать дорогостоящих последствий.",
  },
];

async function seedAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? "admin@tabia.am").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await argon2.hash(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "TABIA Admin" },
    create: { email, name: "TABIA Admin", passwordHash },
  });

  console.info(`Seeded admin user: ${email}`);
}

async function seedContent(): Promise<void> {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  for (const member of team) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: member,
      create: member,
    });
  }

  for (const publication of publications) {
    await prisma.publication.upsert({
      where: {
        type_slug: { type: publication.type, slug: publication.slug },
      },
      update: publication,
      create: publication,
    });
  }

  console.info("Seeded demo services, team, and publications");
}

async function main(): Promise<void> {
  await seedAdmin();
  await seedContent();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
