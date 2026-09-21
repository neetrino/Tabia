import "server-only";

import {
  HOME_PUBLICATIONS_LIMIT,
  HOME_SERVICES_LIMIT,
  HOME_TEAM_LIMIT,
} from "@/shared/config/content";
import { getPublishedPublications } from "@/features/publications";
import { getFeaturedServices } from "@/features/services";
import { getFeaturedTeamMembers } from "@/features/team";

export async function getHomePageData(locale: string) {
  const [services, team, publications] = await Promise.all([
    getFeaturedServices(locale, HOME_SERVICES_LIMIT),
    getFeaturedTeamMembers(locale, HOME_TEAM_LIMIT),
    getPublishedPublications({
      locale,
      limit: HOME_PUBLICATIONS_LIMIT,
    }),
  ]);

  return { services, team, publications };
}
