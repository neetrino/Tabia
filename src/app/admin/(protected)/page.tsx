import Link from "next/link";
import {
  FileText,
  Newspaper,
  Scale,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const cards: ReadonlyArray<{
  href: string;
  key: "news" | "insights" | "services" | "team";
  icon: LucideIcon;
}> = [
  { href: "/admin/news", key: "news", icon: Newspaper },
  { href: "/admin/insights", key: "insights", icon: FileText },
  { href: "/admin/services", key: "services", icon: Scale },
  { href: "/admin/team", key: "team", icon: UsersRound },
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
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              href={card.href}
              prefetch
              className="group rounded-[15px] border border-[var(--border)] bg-white p-5 shadow-sm transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="size-6 shrink-0 text-[var(--brand)] transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h2 className="text-xl">
                  {t(`dashboard.cards.${card.key}.title`)}
                </h2>
              </div>
              <p className="mt-2 pl-9 text-sm text-[var(--muted)]">
                {t(`dashboard.cards.${card.key}.body`)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
