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
    imageUrl: "/images/services/corporate.png",
    sortOrder: 1,
    featured: true,
    titleHy:
      "Կորպորատիվ, առևտրային և մասնավոր հաճախորդների խորհրդատվություն",
    titleEn: "Corporate, commercial and private client advisory",
    titleRu: "Корпоративное, коммерческое и частное консультирование",
    summaryHy:
      "Ընկերության կառուցվածք, կառավարում և գործարքների իրավական աջակցություն։",
    summaryEn:
      "Company structure, governance, and legal support for transactions.",
    summaryRu: "Структура компании, управление и правовая поддержка сделок.",
    bodyHy:
      "Աջակցում ենք կորպորատիվ որոշումներին՝ սկսած հիմնադրումից մինչև վերակազմակերպում։",
    bodyEn: "We support corporate decisions from formation through reorganization.",
    bodyRu: "Поддерживаем корпоративные решения от создания до реорганизации.",
  },
  {
    slug: "natural-resources",
    imageUrl: "/images/services/resources.png",
    sortOrder: 2,
    featured: true,
    titleHy:
      "Բնական ռեսուրսներ, ենթակառուցվածքներ և ՊՊԳ (Պետություն-մասնավոր գործընկերություն)",
    titleEn: "Natural resources, infrastructure and PPP",
    titleRu: "Природные ресурсы, инфраструктура и ГЧП",
    summaryHy:
      "Բնական ռեսուրսների, ենթակառուցվածքների և պետություն-մասնավոր գործընկերության նախագծերի իրավական աջակցություն։",
    summaryEn:
      "Legal support for natural resources, infrastructure, and PPP projects.",
    summaryRu:
      "Правовая поддержка проектов в сфере природных ресурсов, инфраструктуры и ГЧП.",
    bodyHy:
      "Ուղեկցում ենք խոշոր ենթակառուցվածքային և ռեսուրսային գործարքները՝ ռիսկերի կառավարմամբ։",
    bodyEn:
      "We guide major infrastructure and resource transactions with risk control.",
    bodyRu:
      "Сопровождаем крупные инфраструктурные и ресурсные сделки с управлением рисками.",
  },
  {
    slug: "tax-digital-strategy",
    imageUrl: "/images/services/tax-digital.png",
    sortOrder: 3,
    featured: true,
    titleHy: "Հարկային և թվային ռազմավարության խորհրդատվություն",
    titleEn: "Tax and digital strategy advisory",
    titleRu: "Налоговое и цифровое стратегическое консультирование",
    summaryHy:
      "Հարկային պլանավորում և թվային ռազմավարության իրավական համապատասխանություն։",
    summaryEn: "Tax planning and legal alignment for digital strategy.",
    summaryRu:
      "Налоговое планирование и правовое сопровождение цифровой стратегии.",
    bodyHy:
      "Վերլուծում ենք հարկային և թվային հետևանքները և առաջարկում գործնական լուծումներ։",
    bodyEn:
      "We analyze tax and digital implications and propose practical solutions.",
    bodyRu:
      "Анализируем налоговые и цифровые последствия и предлагаем практические решения.",
  },
  {
    slug: "banking-finance",
    imageUrl: "/images/services/banking.png",
    sortOrder: 4,
    featured: true,
    titleHy: "Բանկային գործ, ֆինանսներ և կապիտալի շուկաներ",
    titleEn: "Banking, finance and capital markets",
    titleRu: "Банковское дело, финансы и рынки капитала",
    summaryHy:
      "Բանկային, ֆինանսական և կապիտալի շուկաների գործարքների իրավական աջակցություն։",
    summaryEn: "Legal support for banking, finance, and capital markets deals.",
    summaryRu:
      "Правовая поддержка банковских, финансовых сделок и рынков капитала.",
    bodyHy:
      "Աջակցում ենք ֆինանսավորման կառուցվածքներին և կապիտալի շուկայի գործարքներին։",
    bodyEn: "We support financing structures and capital markets transactions.",
    bodyRu: "Поддерживаем структуры финансирования и сделки на рынках капитала.",
  },
  {
    slug: "aml-compliance",
    imageUrl: "/images/services/compliance.png",
    sortOrder: 5,
    featured: true,
    titleHy:
      "ՓԼ/ԱՖ դեմ պայքար և կարգավորող համապատասխանության (քոմփլայենս) խորհրդատվություն",
    titleEn: "AML/CFT and regulatory compliance advisory",
    titleRu: "ПОД/ФТ и регуляторный комплаенс",
    summaryHy:
      "ՓԼ/ԱՖ դեմ պայքարի և կարգավորող համապատասխանության խորհրդատվություն։",
    summaryEn: "Advisory on AML/CFT and regulatory compliance programs.",
    summaryRu: "Консультирование по ПОД/ФТ и регуляторному комплаенсу.",
    bodyHy:
      "Կառուցում ենք համապատասխանության քաղաքականություններ և գործընթացներ։",
    bodyEn: "We build compliance policies and operational processes.",
    bodyRu: "Выстраиваем политики и процессы комплаенса.",
  },
  {
    slug: "criminal-advisory",
    imageUrl: "/images/services/criminal.png",
    sortOrder: 6,
    featured: true,
    titleHy: "Ռազմավարական քրեաիրավական խորհրդատվություն",
    titleEn: "Strategic criminal law advisory",
    titleRu: "Стратегическое уголовно-правовое консультирование",
    summaryHy: "Ռազմավարական քրեաիրավական խորհրդատվություն և պաշտպանություն։",
    summaryEn: "Strategic criminal law advisory and defense.",
    summaryRu: "Стратегическое уголовно-правовое консультирование и защита.",
    bodyHy:
      "Ապահովում ենք ռազմավարական աջակցություն քրեաիրավական ռիսկերի կառավարման համար։",
    bodyEn: "We provide strategic support for managing criminal law risks.",
    bodyRu:
      "Обеспечиваем стратегическую поддержку в управлении уголовно-правовыми рисками.",
  },
];

const team = [
  {
    slug: "ani-sargsyan",
    photoUrl: "/images/team/member-1.jpg",
    sortOrder: 1,
    featured: true,
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
    photoUrl: "/images/team/member-2.jpg",
    sortOrder: 2,
    featured: true,
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
    photoUrl: "/images/team/member-3.jpg",
    sortOrder: 3,
    featured: true,
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
    detailsHy:
      "Լիլիթը վերլուծում է հարկային ռիսկերը և կառուցում գործնական համապատասխանության լուծումներ։",
    detailsEn:
      "Lilit analyzes tax risks and builds practical compliance solutions.",
    detailsRu:
      "Лилит анализирует налоговые риски и выстраивает практические решения по комплаенсу.",
  },
  {
    slug: "narek-avetyan",
    photoUrl: "/images/team/member-4.jpg",
    sortOrder: 4,
    featured: true,
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
    detailsHy:
      "Նարեկը ներկայացնում է հաճախորդներին վեճերում և բանակցություններում։",
    detailsEn: "Narek represents clients in disputes and negotiations.",
    detailsRu: "Нарек представляет клиентов в спорах и переговорах.",
  },
  {
    slug: "mariam-grigoryan",
    photoUrl: "/images/team/member-5.jpg",
    sortOrder: 5,
    featured: true,
    nameHy: "Մարիամ Գրիգորյան",
    nameEn: "Mariam Grigoryan",
    nameRu: "Мариам Григорян",
    positionHy: "Խորհրդատու",
    positionEn: "Advisor",
    positionRu: "Консультант",
    bioHy: "Կորպորատիվ և կարգավորող համապատասխանության խորհրդատվություն։",
    bioEn: "Corporate and regulatory compliance advisory.",
    bioRu: "Корпоративное и регуляторное комплаенс-консультирование.",
    detailsHy:
      "Մարիամը աջակցում է կորպորատիվ գործընթացներին և կարգավորող պահանջներին։",
    detailsEn:
      "Mariam supports corporate processes and regulatory requirements.",
    detailsRu:
      "Мариам поддерживает корпоративные процессы и регуляторные требования.",
  },
  {
    slug: "david-mkrtchyan",
    photoUrl: "/images/team/member-6.jpg",
    sortOrder: 6,
    featured: true,
    nameHy: "Դավիթ Մկրտչյան",
    nameEn: "David Mkrtchyan",
    nameRu: "Давид Мкртчян",
    positionHy: "Ավագ իրավաբան",
    positionEn: "Senior counsel",
    positionRu: "Старший юрист",
    bioHy: "Ֆինանսական և բանկային իրավունքի մասնագետ։",
    bioEn: "Specialist in finance and banking law.",
    bioRu: "Специалист по финансовому и банковскому праву.",
    detailsHy:
      "Դավիթը ուղեկցում է ֆինանսավորման և բանկային գործարքները։",
    detailsEn: "David advises on financing and banking transactions.",
    detailsRu: "Давид сопровождает сделки по финансированию и банковскому праву.",
  },
  {
    slug: "siranush-karapetyan",
    photoUrl: "/images/team/member-7.jpg",
    sortOrder: 7,
    featured: true,
    nameHy: "Սիրանուշ Կարապետյան",
    nameEn: "Siranush Karapetyan",
    nameRu: "Сирануш Карапетян",
    positionHy: "Իրավաբան",
    positionEn: "Counsel",
    positionRu: "Юрист",
    bioHy: "Քրեաիրավական և համապատասխանության խորհրդատվություն։",
    bioEn: "Criminal law and compliance advisory.",
    bioRu: "Уголовно-правовое и комплаенс-консультирование.",
    detailsHy:
      "Սիրանուշը աջակցում է քրեաիրավական ռիսկերի կառավարմանը և համապատասխանությանը։",
    detailsEn:
      "Siranush supports criminal-law risk management and compliance.",
    detailsRu:
      "Сирануш поддерживает управление уголовно-правовыми рисками и комплаенс.",
  },
];

const publications = [
  {
    slug: "strategic-ma-outlook",
    type: "NEWS" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/news/ma-skyline.jpg",
    publishedAt: new Date("2026-07-28"),
    titleHy: "Ռազմավարական M&A անկայուն շուկայում. իրավական հեռանկար",
    titleEn: "Strategic M&A in a volatile market: a legal outlook",
    titleRu: "Стратегические M&A на нестабильном рынке: правовой взгляд",
    summaryHy:
      "TABIA-ի գործընկերները քննարկում են պատշաճ ստուգման առաջնահերթությունները բարդ ձեռքբերման սցենարների համար։",
    summaryEn:
      "TABIA partners discuss due-diligence priorities for complex acquisition scenarios.",
    summaryRu:
      "Партнеры TABIA обсуждают приоритеты due diligence для сложных сценариев поглощений.",
    bodyHy:
      "<p>Անկայուն շուկայում M&A գործարքները պահանջում են առավել խիստ իրավական վերլուծություն և ռիսկերի կառավարում։</p>",
    bodyEn:
      "<p>In a volatile market, M&A deals require stricter legal analysis and risk management.</p>",
    bodyRu:
      "<p>На нестабильном рынке сделки M&A требуют более строгого правового анализа и управления рисками.</p>",
  },
  {
    slug: "arbitration-vs-litigation",
    type: "INSIGHT" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/news/arbitration-skyline.jpg",
    publishedAt: new Date("2026-07-09"),
    titleHy:
      "Արբիտրաժ ընդդեմ դատավարության. ճիշտ ուղու ընտրությունը առևտրային վեճերում",
    titleEn:
      "Arbitration vs litigation: choosing the right path in commercial disputes",
    titleRu:
      "Арбитраж против суда: выбор правильного пути в коммерческих спорах",
    summaryHy:
      "Ընթացակարգային փոխհատուցումների, ծախսերի ներկայացուցիչ և կատարման ուժ ունեցող նկատառումների վերլուծություն։",
    summaryEn:
      "An analysis of procedural trade-offs, costs, representation and enforceability.",
    summaryRu:
      "Анализ процедурных компромиссов, издержек, представительства и исполнимости.",
    bodyHy:
      "<p>Առևտրային վեճերում ուղու ընտրությունը ազդում է ժամկետների, ծախսերի և կատարման հնարավորությունների վրա։</p>",
    bodyEn:
      "<p>In commercial disputes, the choice of forum affects timelines, costs and enforcement options.</p>",
    bodyRu:
      "<p>В коммерческих спорах выбор форума влияет на сроки, расходы и возможности исполнения.</p>",
  },
  {
    slug: "strategic-ma-priorities",
    type: "NEWS" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/news/ma-skyline.jpg",
    publishedAt: new Date("2026-07-28"),
    titleHy: "Ռազմավարական M&A անկայուն շուկայում. իրավական հեռանկար",
    titleEn: "Strategic M&A in a volatile market: a legal outlook",
    titleRu: "Стратегические M&A на нестабильном рынке: правовой взгляд",
    summaryHy:
      "TABIA-ի գործընկերները քննարկում են պատշաճ ստուգման առաջնահերթությունները բարդ ձեռքբերման սցենարների համար։",
    summaryEn:
      "TABIA partners discuss due-diligence priorities for complex acquisition scenarios.",
    summaryRu:
      "Партнеры TABIA обсуждают приоритеты due diligence для сложных сценариев поглощений.",
    bodyHy:
      "<p>Անկայուն շուկայում M&A գործարքները պահանջում են առավել խիստ իրավական վերլուծություն և ռիսկերի կառավարում։</p>",
    bodyEn:
      "<p>In a volatile market, M&A deals require stricter legal analysis and risk management.</p>",
    bodyRu:
      "<p>На нестабильном рынке сделки M&A требуют более строгого правового анализа и управления рисками.</p>",
  },
  {
    slug: "commercial-dispute-pathways",
    type: "INSIGHT" as const,
    status: "PUBLISHED" as const,
    coverUrl: "/images/news/arbitration-skyline.jpg",
    publishedAt: new Date("2026-07-09"),
    titleHy:
      "Արբիտրաժ ընդդեմ դատավարության. ճիշտ ուղու ընտրությունը առևտրային վեճերում",
    titleEn:
      "Arbitration vs litigation: choosing the right path in commercial disputes",
    titleRu:
      "Арбитраж против суда: выбор правильного пути в коммерческих спорах",
    summaryHy:
      "Ընթացակարգային փոխհատուցումների, ծախսերի ներկայացուցիչ և կատարման ուժ ունեցող նկատառումների վերլուծություն։",
    summaryEn:
      "An analysis of procedural trade-offs, costs, representation and enforceability.",
    summaryRu:
      "Анализ процедурных компромиссов, издержек, представительства и исполнимости.",
    bodyHy:
      "<p>Առևտրային վեճերում ուղու ընտրությունը ազդում է ժամկետների, ծախսերի և կատարման հնարավորությունների վրա։</p>",
    bodyEn:
      "<p>In commercial disputes, the choice of forum affects timelines, costs and enforcement options.</p>",
    bodyRu:
      "<p>В коммерческих спорах выбор форума влияет на сроки, расходы и возможности исполнения.</p>",
  },
];

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seed");
  }

  const passwordHash = await argon2.hash(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "TABIA Admin" },
    create: { email, name: "TABIA Admin", passwordHash },
  });

  console.info(`Seeded admin user: ${email}`);
}

async function seedContent(): Promise<void> {
  const serviceSlugs = services.map((service) => service.slug);

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  await prisma.service.updateMany({
    where: { slug: { notIn: serviceSlugs } },
    data: { featured: false, visibility: "HIDDEN" },
  });

  for (const member of team) {
    await prisma.teamMember.upsert({
      where: { slug: member.slug },
      update: { ...member, visibility: "PUBLISHED" },
      create: { ...member, visibility: "PUBLISHED" },
    });
  }

  const teamSlugs = team.map((member) => member.slug);
  await prisma.teamMember.updateMany({
    where: { slug: { notIn: teamSlugs } },
    data: { featured: false, visibility: "HIDDEN" },
  });

  for (const publication of publications) {
    await prisma.publication.upsert({
      where: {
        type_slug: { type: publication.type, slug: publication.slug },
      },
      update: publication,
      create: publication,
    });
  }

  await prisma.publication.updateMany({
    where: {
      NOT: {
        OR: publications.map((publication) => ({
          type: publication.type,
          slug: publication.slug,
        })),
      },
    },
    data: { status: "ARCHIVED" },
  });

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
