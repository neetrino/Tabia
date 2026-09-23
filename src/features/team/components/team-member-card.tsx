import { Mail, Phone, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getInitials } from "@/shared/lib/localized";
import { CoverMedia } from "@/shared/ui/cover-media";
import type { TeamMemberPreview } from "../types";

type TeamMemberCardProps = {
  member: TeamMemberPreview;
  readMoreLabel: string;
  linkedInLabel: string;
};

export function TeamMemberCard({
  member,
  readMoreLabel,
  linkedInLabel,
}: TeamMemberCardProps) {
  const href = `/team/${member.slug}` as const;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-black/[0.06] bg-[var(--surface)] p-3 transition duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] motion-reduce:transform-none">
      <Link
        href={href}
        className="absolute inset-0 z-[1] rounded-[24px]"
        aria-label={member.name}
      />
      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-white lg:h-56">
        <CoverMedia
          src={member.photoUrl}
          alt={member.name}
          className="h-full rounded-2xl bg-white"
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
            className="pointer-events-none absolute inset-0 rounded-2xl bg-white/20 mix-blend-saturation"
          />
        ) : null}
      </div>
      <div className="relative flex flex-1 flex-col pt-4">
        <p className="inline-flex w-fit max-w-full truncate rounded-full border border-[#747878] px-3 py-1 text-[11px] font-normal leading-[16.5px] tracking-[0.26px] text-[#0a0a0a] lg:px-[17px] lg:py-[7px] lg:text-[13px] lg:font-semibold lg:leading-[13px]">
          {member.name}
        </p>
        <p className="mt-2 line-clamp-2 min-h-[36px] text-xs leading-[18px] text-[#444748] lg:min-h-[42px] lg:text-sm lg:leading-[21px]">
          {member.position}
        </p>
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm font-light leading-relaxed text-[#444748]">
          {member.bio || "\u00a0"}
        </p>
        <div className="relative z-10 mt-4 min-h-[4.75rem]">
          <TeamMemberContacts member={member} linkedInLabel={linkedInLabel} />
        </div>
        <span className="mt-auto pt-4 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)] transition group-hover:translate-x-0.5">
          {readMoreLabel} →
        </span>
      </div>
    </article>
  );
}

function TeamMemberContacts({
  member,
  linkedInLabel,
}: {
  member: TeamMemberPreview;
  linkedInLabel: string;
}) {
  const hasContacts = member.email || member.phone || member.linkedInUrl;
  if (!hasContacts) {
    return null;
  }

  return (
    <ul className="space-y-2 text-sm text-[#444748]">
      {member.email ? (
        <li>
          <a
            href={`mailto:${member.email}`}
            className="inline-flex items-center gap-2 transition hover:text-[var(--brand)]"
          >
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{member.email}</span>
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
            {linkedInLabel}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
