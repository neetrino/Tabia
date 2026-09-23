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
    <article className="group relative flex h-full flex-col transition duration-500 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link
        href={href}
        className="absolute inset-0 z-[1] rounded-3xl"
        aria-label={member.name}
      />
      <div className="relative h-64 overflow-hidden rounded-2xl bg-white lg:h-72 lg:rounded-3xl">
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
      <p className="relative mt-3 inline-flex w-fit rounded-full border border-[#747878] px-3 py-1 text-[11px] font-normal leading-[16.5px] tracking-[0.26px] text-[#0a0a0a] lg:mt-4 lg:px-[17px] lg:py-[7px] lg:text-[13px] lg:font-semibold lg:leading-[13px]">
        {member.name}
      </p>
      <p className="relative mt-2 pl-1 text-xs leading-[18px] text-[#444748] lg:text-sm lg:leading-[21px]">
        {member.position}
      </p>
      {member.bio ? (
        <p className="relative mt-3 line-clamp-3 text-sm font-light leading-relaxed text-[#444748]">
          {member.bio}
        </p>
      ) : null}
      <TeamMemberContacts member={member} linkedInLabel={linkedInLabel} />
      <span className="relative mt-4 text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)] transition group-hover:translate-x-0.5">
        {readMoreLabel} →
      </span>
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
    <ul className="relative z-10 mt-4 space-y-2 text-sm text-[#444748]">
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
