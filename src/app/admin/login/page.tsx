import Image from "next/image";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AdminLocaleSwitcher, AdminLoginForm } from "@/features/admin";
import { getAdminSession } from "@/features/auth";
import { HOME_ASSETS } from "@/shared/config/content";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  const t = await getTranslations("admin");

  return (
    <div className="admin-app flex min-h-screen flex-col justify-center bg-[var(--cream)] px-5 py-16">
      <div className="mx-auto w-full max-w-[440px]">
        <Image
          src={HOME_ASSETS.logoDark}
          alt="TABIA"
          width={131}
          height={38}
          priority
          className="mx-auto mb-8 block h-[38px] w-auto"
        />
        <div className="rounded-[40px] border border-black/10 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)] sm:p-8 lg:rounded-[48px]">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[32px] font-semibold uppercase leading-[40px] text-[#0a0a0a]">
              {t("login.title")}
            </h1>
            <AdminLocaleSwitcher variant="dropdown" />
          </div>
          <p className="mt-4 text-sm font-light uppercase leading-[21px] tracking-[0.35px] text-black/70">
            {t("login.subtitle")}
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
