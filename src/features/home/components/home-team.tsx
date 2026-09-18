import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TeamMemberPreview } from "@/features/team";
import { HOME_ASSETS } from "@/shared/config/content";
import { getInitials } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
import { SectionLabel } from "@/shared/ui/section-label";

type HomeTeamProps = {
  items: TeamMemberPreview[];
};

type TeamSlot =
  | { type: "member"; member: TeamMemberPreview }
  | { type: "highlight" };

export async function HomeTeam({ items }: HomeTeamProps) {
  const t = await getTranslations("home");
  const team = await getTranslations("team");
  const slots = buildTeamSlots(items);

  return (
    <section className="relative bg-white">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("team.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1281px] px-6 pb-24 pt-20 lg:px-8">
        <h2 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1.14] tracking-[-0.05em] text-[#0a0a0a]">
          {t("team.title")}
        </h2>
        <p className="mt-8 max-w-xl text-sm uppercase tracking-[0.35px] text-[#0a0a0a]">
          {t("team.description")}
        </p>
        {items.length === 0 ? (
          <EmptyState message={team("empty")} className="mt-12" />
        ) : (
          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
            {slots.map((slot) =>
              slot.type === "highlight" ? (
                <HighlightCard
                  key="highlight"
                  quote={t("team.highlightQuote")}
                  name={t("team.highlightName")}
                  role={t("team.highlightRole")}
                />
              ) : (
                <MemberCard key={slot.member.slug} member={slot.member} />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function buildTeamSlots(items: TeamMemberPreview[]): TeamSlot[] {
  const members = items.slice(0, 7);
  const leading = members.slice(0, 3).map((member) => ({
    type: "member" as const,
    member,
  }));
  const rest = members.slice(3).map((member) => ({
    type: "member" as const,
    member,
  }));

  return [...leading, { type: "highlight" }, ...rest];
}

function MemberCard({ member }: { member: TeamMemberPreview }) {
  return (
    <article>
      <Link href="/team" className="group block">
        <CoverMedia
          src={member.photoUrl}
          alt={member.name}
          className="h-72 rounded-3xl bg-white"
          imageClassName="object-cover object-top grayscale"
          fallback={
            <div className="grid h-full place-items-center bg-[var(--brand)] text-4xl tracking-[0.12em] text-white/80">
              {getInitials(member.name)}
            </div>
          }
        />
        <p className="mt-4 inline-flex rounded-full border border-[#747878] px-[17px] py-[7px] text-[13px] font-semibold tracking-[0.26px] text-[#0a0a0a]">
          {member.name}
        </p>
        <p className="mt-2 pl-2 text-sm text-[#444748]">{member.position}</p>
      </Link>
    </article>
  );
}

function HighlightCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <article>
      <div className="flex h-72 flex-col justify-between rounded-3xl bg-[var(--brand)] p-6">
        <div className="flex items-center">
          <span className="grid size-8 place-items-center rounded-full bg-white">
            <img src={HOME_ASSETS.quoteLeft} alt="" />
          </span>
          <span className="ml-2 grid size-8 place-items-center rounded-full bg-white">
            <img src={HOME_ASSETS.quoteRight} alt="" />
          </span>
        </div>
        <p className="text-sm leading-[21px] text-white">{quote}</p>
      </div>
      <p className="mt-4 inline-flex rounded-full border border-[#747878] px-[17px] py-[7px] text-[13px] font-semibold tracking-[0.26px] text-[#0a0a0a]">
        {name}
      </p>
      <p className="mt-2 pl-2 text-sm text-[#444748]">{role}</p>
    </article>
  );
}
