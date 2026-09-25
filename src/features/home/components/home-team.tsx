import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TeamMemberPreview } from "@/features/team";
import { getInitials } from "@/shared/lib/localized";
import { Reveal } from "@/shared/motion/reveal";
import { revealDelay } from "@/shared/motion/timing";
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
      <SectionLabel>{t("team.label")}</SectionLabel>
      <div className="mx-auto max-w-[1281px] px-5 pb-[133px] pt-12 lg:px-8 lg:pb-24 lg:pr-16 lg:pt-[60px]">
        <Reveal>
          <h2 className="max-w-[363px] text-[32px] font-normal uppercase leading-[40px] tracking-[-2px] text-[#0a0a0a] lg:max-w-[672px] lg:whitespace-pre-line lg:text-[56px] lg:font-bold lg:leading-[64px] lg:tracking-[-3.28px]">
            {t.rich("team.title", {
              em: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
        <div className="flex h-[84px] w-[350px] max-w-full items-end gap-[59px] pt-3 lg:mt-[45px] lg:h-auto lg:w-auto lg:block lg:pt-0">
          <p className="w-[207px] self-start text-xs uppercase leading-[18px] tracking-[0.35px] text-[#0a0a0a] lg:w-auto lg:max-w-xl lg:text-sm lg:leading-[21px]">
            {t("team.description")}
          </p>
          <Link
            href="/team"
            className="shrink-0 border-b border-black/98 pb-1 text-sm uppercase leading-[13.5px] tracking-[1px] text-black lg:hidden"
          >
            {t("team.viewAll")} →
          </Link>
        </div>
        </Reveal>
        {items.length === 0 ? (
          <EmptyState message={team("empty")} className="mt-12" />
        ) : (
          <div className="mt-[63px] -mx-5 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x pt-8 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:mt-14 lg:overflow-visible lg:pt-4 lg:touch-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-4 px-5 lg:grid lg:w-auto lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12 lg:px-0 xl:grid-cols-4">
              {items.map((member, index) => (
                <Reveal
                  key={member.slug}
                  className="h-full shrink-0 lg:w-auto"
                  delay={revealDelay(index)}
                  y={0}
                >
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMemberPreview }) {
  return (
    <article className="flex h-full w-[173px] shrink-0 flex-col lg:w-auto">
      <Link href={`/team/${member.slug}`} className="group flex h-full flex-col">
        <div className="relative h-[220px] shrink-0 overflow-hidden rounded-2xl bg-white lg:mb-4 lg:h-72 lg:rounded-3xl">
          <CoverMedia
            src={member.photoUrl}
            alt={member.name}
            className="h-full rounded-none bg-white"
            imageClassName="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
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
        <p className="mt-2 inline-flex max-w-full truncate rounded-full border border-[#747878] px-3 py-1 text-[11px] font-normal leading-[16.5px] tracking-[0.26px] text-[#0a0a0a] lg:mt-0 lg:px-[17px] lg:py-[7px] lg:text-[13px] lg:font-semibold lg:leading-[13px]">
          {member.name}
        </p>
        <p className="line-clamp-2 min-h-[36px] pl-2 text-xs leading-[18px] text-[#444748] lg:mt-2 lg:min-h-[42px] lg:text-sm lg:leading-[21px]">
          {member.position}
        </p>
      </Link>
    </article>
  );
}
