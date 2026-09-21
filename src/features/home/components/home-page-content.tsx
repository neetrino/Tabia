import { HomeAbout } from "./home-about";
import { HomeHero } from "./home-hero";
import { HomePublications } from "./home-publications";
import { HomeServices } from "./home-services";
import { HomeTeam } from "./home-team";
import { getHomePageData } from "../queries";

type HomePageContentProps = {
  locale: string;
};

export async function HomePageContent({ locale }: HomePageContentProps) {
  const { services, team, publications } = await getHomePageData(locale);

  return (
    <div>
      <HomeHero />
      <HomeAbout />
      <HomeServices items={services} />
      <HomeTeam items={team} />
      <HomePublications locale={locale} items={publications} />
    </div>
  );
}
