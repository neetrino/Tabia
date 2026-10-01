import "server-only";

import {
  HOME_PUBLICATIONS_LIMIT,
  HOME_SERVICES_LIMIT,
  HOME_TEAM_LIMIT,
} from "@/shared/config/content";
import { getFeaturedPublications } from "@/features/publications";
import { getFeaturedServices } from "@/features/services";
import { getFeaturedTeamMembers } from "@/features/team";
import { logError } from "@/shared/lib/logger";

type HomePageData = {
  services: Awaited<ReturnType<typeof getFeaturedServices>>;
  team: Awaited<ReturnType<typeof getFeaturedTeamMembers>>;
  publications: Awaited<ReturnType<typeof getFeaturedPublications>>;
};

function emptyHomePage(): HomePageData {
  return { services: [], team: [], publications: [] };
}

export async function getHomePageData(locale: string): Promise<HomePageData> {
  if (!process.env.DATABASE_URL) {
    return emptyHomePage();
  }

  try {
    const [services, team, publications] = await Promise.all([
      getFeaturedServices(locale, HOME_SERVICES_LIMIT),
      getFeaturedTeamMembers(locale, HOME_TEAM_LIMIT),
      getFeaturedPublications(locale, HOME_PUBLICATIONS_LIMIT),
    ]);

    return { services, team, publications };
  } catch (error) {
    logError("home", error);
    return emptyHomePage();
  }
}
