import "server-only";

import {
  HOME_PUBLICATIONS_LIMIT,
  HOME_SERVICES_LIMIT,
  HOME_TEAM_LIMIT,
} from "@/shared/config/content";
import { getPublishedPublications } from "@/features/publications";
import { getPublishedServices } from "@/features/services";
import { getPublishedTeamMembers } from "@/features/team";

export async function getHomePageData(locale: string) {
  const [services, team, publications] = await Promise.all([
    getPublishedServices(locale, HOME_SERVICES_LIMIT),
    getPublishedTeamMembers(locale, HOME_TEAM_LIMIT),
    getPublishedPublications({
      locale,
      limit: HOME_PUBLICATIONS_LIMIT,
    }),
  ]);

  return { services, team, publications };
}
