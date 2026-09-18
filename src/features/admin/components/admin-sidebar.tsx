import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { logoutAction } from "@/features/auth/actions";
import { SiteBrand } from "@/shared/ui/site-brand";
import { AdminLocaleSwitcher } from "./admin-locale-switcher";

const links = [
  { href: "/admin", key: "dashboard" as const },
  { href: "/admin/news", key: "news" as const },
  { href: "/admin/insights", key: "insights" as const },
  { href: "/admin/services", key: "services" as const },
  { href: "/admin/team", key: "team" as const },
];

type AdminSidebarProps = {
  email: string;
};

export async function AdminSidebar({ email }: AdminSidebarProps) {
  const t = await getTranslations("admin");
  const common = await getTranslations("common");

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="border-b border-[var(--border)] bg-[var(--ink)] px-5 py-5">
        <SiteBrand label={common("brand")} />
        <p className="mt-3 truncate text-xs text-white/60">{email}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]"
          >
            {t(`nav.${link.key}`)}
          </Link>
        ))}
      </nav>
      <div className="space-y-3 border-t border-[var(--border)] p-3">
        <AdminLocaleSwitcher />
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
          >
            {t("logout")}
          </button>
        </form>
      </div>
    </aside>
  );
}
