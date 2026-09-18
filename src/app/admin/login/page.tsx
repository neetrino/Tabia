import { getTranslations } from "next-intl/server";
import { AdminLocaleSwitcher, AdminLoginForm } from "@/features/admin";

export default async function AdminLoginPage() {
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">{t("login.title")}</h1>
          <AdminLocaleSwitcher />
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("login.subtitle")}</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
