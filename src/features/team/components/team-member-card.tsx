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
  return (
    <article className="flex h-full flex-col">
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
      <div className="flex flex-1 flex-col pt-4">
        <h2 className="text-lg tracking-tight">{member.name}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{member.position}</p>
        <p className="mt-3 text-sm leading-relaxed text-[#444748]">
          {member.bio}
        </p>
        <TeamMemberContacts member={member} linkedInLabel={linkedInLabel} />
        {member.hasProfile ? (
          <Link
            href={`/team/${member.slug}`}
            className="mt-4 text-sm font-semibold text-[var(--brand)] hover:underline"
          >
            {readMoreLabel}
          </Link>
        ) : null}
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
    <ul className="mt-4 space-y-2 text-sm text-[#444748]">
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
            {linkedInLabel}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
