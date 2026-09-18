import "server-only";

import { prisma } from "@/shared/lib/prisma";
import { localizedText } from "@/shared/lib/localized";

export type TeamMemberPreview = {
  slug: string;
  name: string;
  position: string;
  photoUrl: string | null;
};

export async function getPublishedTeamMembers(
  locale: string,
  limit?: number,
): Promise<TeamMemberPreview[]> {
  const records = await prisma.teamMember.findMany({
    where: { visibility: "PUBLISHED" },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });

  return records.map((record) => ({
    slug: record.slug,
    name: localizedText(locale, {
      hy: record.nameHy,
      en: record.nameEn,
      ru: record.nameRu,
    }),
    position: localizedText(locale, {
      hy: record.positionHy,
      en: record.positionEn,
      ru: record.positionRu,
    }),
    photoUrl: record.photoUrl,
  }));
}
