import { HomeAbout } from "./home-about";
import { HomeHero } from "./home-hero";
import { HomePublications } from "./home-publications";
import { HomeServices } from "./home-services";
import { HomeTeam } from "./home-team";
import { getHomePageData } from "../queries";
import { DeferredSection } from "@/shared/ui/deferred-section";

type HomePageContentProps = {
  locale: string;
};

export async function HomePageContent({ locale }: HomePageContentProps) {
  const { services, team, publications } = await getHomePageData(locale);

  return (
    <div>
      <HomeHero />
      <DeferredSection intrinsicHeight="704px">
        <HomeAbout />
      </DeferredSection>
      <DeferredSection intrinsicHeight="720px">
        <HomeServices items={services} />
      </DeferredSection>
      <DeferredSection intrinsicHeight="640px">
        <HomeTeam items={team} />
      </DeferredSection>
      <DeferredSection intrinsicHeight="600px">
        <HomePublications locale={locale} items={publications} />
      </DeferredSection>
    </div>
  );
}
