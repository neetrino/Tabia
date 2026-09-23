import { redirect } from "next/navigation";
import { getAdminSession } from "@/features/auth";
import { AdminSidebar } from "@/features/admin";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <AdminSidebar email={session.email} />
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
