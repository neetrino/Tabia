import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAdminSession } from "@/features/auth/session";
import { AdminResourceShell } from "./admin-resource-shell";

export type AdminResourceKey = "news" | "insights" | "services" | "team";

type AdminGuardedResourceProps = {
  resource: AdminResourceKey;
};

export async function AdminGuardedResource({
  resource,
}: AdminGuardedResourceProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const t = await getTranslations("admin");

  return (
    <AdminResourceShell
      title={t(`resources.${resource}.title`)}
      description={t(`resources.${resource}.description`)}
      addLabel={t(`resources.${resource}.add`)}
      drawerTitle={t(`resources.${resource}.drawerTitle`)}
      drawerContent={
        <p className="text-sm text-[var(--muted)]">
          {t("resources.placeholder")}
        </p>
      }
    />
  );
}
