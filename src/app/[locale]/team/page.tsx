import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedTeamMembers } from "@/features/team";
import { getInitials } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";

type PageProps = { params: Promise<{ locale: string }> };

export default async function TeamPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const items = await getPublishedTeamMembers(locale);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:px-6">
      <header className="space-y-4">
        <h1 className="text-4xl tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">{t("subtitle")}</p>
      </header>
      {items.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((member) => (
            <article key={member.slug}>
              <CoverMedia
                src={member.photoUrl}
                alt={member.name}
                className="aspect-[3/4]"
                fallback={
                  <div className="grid h-full place-items-center bg-[var(--brand)] text-4xl tracking-[0.12em] text-white/80">
                    {getInitials(member.name)}
                  </div>
                }
              />
              <div className="pt-4">
                <h2 className="text-lg tracking-tight">{member.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {member.position}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
