import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { getInitials } from "@/shared/lib/localized";
import { ArticleBackLink, ArticleTitle } from "@/shared/ui/article-chrome";
import { CoverMedia } from "@/shared/ui/cover-media";
import { InteriorPageShell } from "@/shared/ui/interior-page-header";
import { getPublishedTeamMemberBySlug } from "../queries";

type TeamMemberProfileProps = {
  locale: string;
  slug: string;
};

export async function TeamMemberProfile({
  locale,
  slug,
}: TeamMemberProfileProps) {
  const member = await getPublishedTeamMemberBySlug(locale, slug);
  if (!member) {
    notFound();
  }

  const t = await getTranslations("team");
  const common = await getTranslations("common");

  return (
    <InteriorPageShell>
      <article>
        <ArticleBackLink href="/team" label={t("back")} />

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
          <CoverMedia
            src={member.photoUrl}
            alt={member.name}
            className="aspect-[3/4] rounded-2xl bg-white lg:rounded-3xl"
            imageClassName="object-cover object-top"
            fallback={
              <div className="grid h-full place-items-center bg-[var(--brand)] text-5xl tracking-[0.12em] text-white/80">
                {getInitials(member.name)}
              </div>
            }
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
              {common("nav.team")}
            </p>
            <ArticleTitle className="mt-3 normal-case tracking-[-0.5px] lg:tracking-[-1px]">
              {member.name}
            </ArticleTitle>
            <p className="mt-3 inline-flex rounded-full border border-[#747878] px-4 py-2 text-[13px] font-semibold leading-[13px] text-[#0a0a0a]">
              {member.position}
            </p>
            {member.bio ? (
              <p className="mt-6 max-w-[560px] text-base font-light leading-[1.75] text-[#363636] lg:text-lg lg:leading-[1.8]">
                {member.bio}
              </p>
            ) : null}

            <ul className="mt-8 space-y-3 text-sm text-[#444748]">
              {member.email ? (
                <li>
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                  >
                    <Mail className="size-4 shrink-0" />
                    {member.email}
                  </a>
                </li>
              ) : null}
              {member.phone ? (
                <li>
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                  >
                    <Phone className="size-4 shrink-0" />
                    {member.phone}
                  </a>
                </li>
              ) : null}
              {member.linkedInUrl ? (
                <li>
                  <a
                    href={member.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
                  >
                    <ExternalLink className="size-4 shrink-0" />
                    {t("linkedIn")}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {member.details.trim().length > 0 ? (
          <div className="mx-auto mt-12 max-w-[720px] space-y-4 whitespace-pre-line border-t border-black/10 pt-10 text-base font-light leading-[1.75] text-[#363636] lg:mt-16 lg:text-lg lg:leading-[1.8]">
            {member.details}
          </div>
        ) : null}
      </article>
    </InteriorPageShell>
  );
}
