import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TeamMemberPreview } from "@/features/team";
import { getInitials } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";
import { SectionLabel } from "@/shared/ui/section-label";

type HomeTeamProps = {
  items: TeamMemberPreview[];
};

export async function HomeTeam({ items }: HomeTeamProps) {
  const t = await getTranslations("home");
  const team = await getTranslations("team");

  return (
    <section className="relative bg-white">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
        <SectionLabel>{t("team.label")}</SectionLabel>
      </div>
      <div className="mx-auto max-w-[1281px] px-6 pb-24 pt-[60px] lg:px-8 lg:pr-16">
        <h2 className="max-w-[672px] whitespace-pre-line text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[1.14] tracking-[-0.0586em] text-[#0a0a0a] lg:text-[56px] lg:leading-[64px] lg:tracking-[-3.28px]">
          {t("team.title")}
        </h2>
        <p className="mt-8 max-w-xl text-sm uppercase leading-[21px] tracking-[0.35px] text-[#0a0a0a] lg:mt-[45px]">
          {t("team.description")}
        </p>
        {items.length === 0 ? (
          <EmptyState message={team("empty")} className="mt-12" />
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-12 pt-4 sm:grid-cols-2 xl:grid-cols-4 lg:mt-14">
            {items.map((member) => (
              <MemberCard key={member.slug} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMemberPreview }) {
  return (
    <article>
      <Link
        href={member.hasProfile ? `/team/${member.slug}` : "/team"}
        className="group block"
      >
        <div className="relative mb-4 h-72 overflow-hidden rounded-3xl bg-white">
          <CoverMedia
            src={member.photoUrl}
            alt={member.name}
            className="h-full rounded-none bg-white"
            imageClassName="object-cover object-top"
            fallback={
              <div className="grid h-full place-items-center bg-[var(--brand)] text-4xl tracking-[0.12em] text-white/80">
                {getInitials(member.name)}
              </div>
            }
          />
          {member.photoUrl ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-white/20 mix-blend-saturation"
            />
          ) : null}
        </div>
        <p className="inline-flex rounded-full border border-[#747878] px-[17px] py-[7px] text-[13px] font-semibold leading-[13px] tracking-[0.26px] text-[#0a0a0a]">
          {member.name}
        </p>
        <p className="mt-2 pl-2 text-sm leading-[21px] text-[#444748]">
          {member.position}
        </p>
      </Link>
    </article>
  );
}
