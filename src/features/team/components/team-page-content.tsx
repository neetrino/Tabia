import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";
import { getPublishedTeamMembers } from "../queries";
import { TeamMemberCard } from "./team-member-card";

type TeamPageContentProps = {
  locale: string;
};

export async function TeamPageContent({ locale }: TeamPageContentProps) {
  const t = await getTranslations("team");
  const items = await getPublishedTeamMembers(locale);

  return (
    <InteriorPageShell>
      <InteriorPageHeader
        titleLead={t("titleLead")}
        titleTail={t("titleTail")}
        subtitle={t("subtitle")}
      />
      {items.length === 0 ? (
        <EmptyState message={t("empty")} className="mt-12 lg:mt-16" />
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:gap-x-6 lg:gap-y-12 xl:grid-cols-4">
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
    </InteriorPageShell>
  );
}
