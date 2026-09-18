import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { getAdminSession } from "@/features/auth/session";
import { AdminSidebar } from "@/features/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  setRequestLocale(locale);
  const messages = await getMessages();
  const session = await getAdminSession();

  const content = session ? (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AdminSidebar email={session.email} />
      <div className="flex-1 overflow-auto p-6 md:p-8">{children}</div>
    </div>
  ) : (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      {content}
    </NextIntlClientProvider>
  );
}
