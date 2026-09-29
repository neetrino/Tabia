import { HomeAbout } from "./home-about";
import { HomeHero } from "./home-hero";
import { HomePublications } from "./home-publications";
import { HomeServices } from "./home-services";
import { HomeTeam } from "./home-team";
import { getHomePageData } from "../queries";
import { DeferredSection } from "@/shared/ui/deferred-section";

/** Room above each section so the Figma seam pill is not clipped. */
const sectionOverlapClassName = "relative z-10 -mt-7 pt-7";

type HomePageContentProps = {
  locale: string;
};

export async function HomePageContent({ locale }: HomePageContentProps) {
  const { services, team, publications } = await getHomePageData(locale);

  return (
    <div>
      <HomeHero />
      <DeferredSection className={sectionOverlapClassName} intrinsicHeight="704px">
        <HomeAbout />
      </DeferredSection>
      <DeferredSection className={sectionOverlapClassName} intrinsicHeight="720px">
        <HomeServices items={services} />
      </DeferredSection>
      <DeferredSection className={sectionOverlapClassName} intrinsicHeight="640px">
        <HomeTeam items={team} />
      </DeferredSection>
      <DeferredSection className={sectionOverlapClassName} intrinsicHeight="600px">
        <HomePublications locale={locale} items={publications} />
      </DeferredSection>
    </div>
  );
}
