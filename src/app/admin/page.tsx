import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAdminSession } from "@/features/auth/session";

const cards = [
  { href: "/admin/news", key: "news" as const },
  { href: "/admin/insights", key: "insights" as const },
  { href: "/admin/services", key: "services" as const },
  { href: "/admin/team", key: "team" as const },
];

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

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
            className="rounded-md border border-[var(--border)] bg-white p-5 transition hover:border-[var(--brand)]"
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
