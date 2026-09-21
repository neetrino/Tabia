import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/shared/ui/empty-state";
import { getPublishedTeamMembers } from "../queries";
import { TeamMemberCard } from "./team-member-card";

type TeamPageContentProps = {
  locale: string;
};

export async function TeamPageContent({ locale }: TeamPageContentProps) {
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((member) => (
            <TeamMemberCard
              key={member.slug}
              member={member}
              readMoreLabel={t("readMore")}
              linkedInLabel={t("linkedIn")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
