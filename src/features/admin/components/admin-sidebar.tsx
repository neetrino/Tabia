import { getTranslations } from "next-intl/server";
import { logoutAction } from "@/features/auth/client";
import { SiteBrand } from "@/shared/ui/site-brand";
import { AdminLocaleSwitcher } from "./admin-locale-switcher";
import { AdminNavLinks } from "./admin-nav-links";

type AdminSidebarProps = {
  email: string;
};

export async function AdminSidebar({ email }: AdminSidebarProps) {
  const t = await getTranslations("admin");
  const common = await getTranslations("common");

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden rounded-tr-[20px] rounded-br-[20px] bg-black text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <SiteBrand label={common("brand")} />
        <p className="mt-3 truncate text-xs text-white/60">{email}</p>
      </div>
      <AdminNavLinks />
      <div className="flex items-center gap-2 border-t border-white/10 p-3">
        <div className="min-w-0 flex-1">
          <AdminLocaleSwitcher tone="dark" />
        </div>
        <form action={logoutAction} className="shrink-0">
          <button
            type="submit"
            className="flex h-10 items-center justify-center rounded-[15px] border border-white/15 bg-white/5 px-3 text-sm whitespace-nowrap text-white transition-[transform,background-color] duration-200 ease-out hover:scale-[1.02] hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            {t("logout")}
          </button>
        </form>
      </div>
    </aside>
  );
}
