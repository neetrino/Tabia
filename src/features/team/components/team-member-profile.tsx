import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getInitials } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
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

  return (
    <article className="mx-auto max-w-4xl space-y-10 px-4 py-16 md:px-6">
      <Link
        href="/team"
        className="text-sm font-semibold text-[var(--brand)] hover:underline"
      >
        {t("back")}
      </Link>
      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        <CoverMedia
          src={member.photoUrl}
          alt={member.name}
          className="aspect-[3/4] rounded-3xl bg-white"
          imageClassName="object-cover object-top grayscale"
          fallback={
            <div className="grid h-full place-items-center bg-[var(--brand)] text-5xl tracking-[0.12em] text-white/80">
              {getInitials(member.name)}
            </div>
          }
        />
        <div className="space-y-4">
          <h1 className="text-4xl tracking-tight">{member.name}</h1>
          <p className="text-lg text-[var(--muted)]">{member.position}</p>
          <p className="leading-relaxed text-[#444748]">{member.bio}</p>
          <ul className="space-y-2 text-sm text-[#444748]">
            {member.email ? (
              <li>
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 hover:text-[var(--brand)]"
                >
                  <Mail className="size-4" />
                  {member.email}
                </a>
              </li>
            ) : null}
            {member.phone ? (
              <li>
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-2 hover:text-[var(--brand)]"
                >
                  <Phone className="size-4" />
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
                  className="inline-flex items-center gap-2 hover:text-[var(--brand)]"
                >
                  <ExternalLink className="size-4" />
                  {t("linkedIn")}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      {member.details.trim().length > 0 ? (
        <div className="max-w-3xl space-y-4 leading-relaxed whitespace-pre-line text-[#444748]">
          {member.details}
        </div>
      ) : null}
    </article>
  );
}
