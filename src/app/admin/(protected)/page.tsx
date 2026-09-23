import Link from "next/link";
import { getTranslations } from "next-intl/server";

const cards = [
  { href: "/admin/news", key: "news" as const },
  { href: "/admin/insights", key: "insights" as const },
  { href: "/admin/services", key: "services" as const },
  { href: "/admin/team", key: "team" as const },
];

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">{t("dashboard.title")}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {t("dashboard.subtitle")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            prefetch
            className="rounded-[15px] border border-[var(--border)] bg-white p-5 shadow-sm transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <h2 className="text-xl">{t(`dashboard.cards.${card.key}.title`)}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {t(`dashboard.cards.${card.key}.body`)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
