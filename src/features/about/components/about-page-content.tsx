import { getTranslations } from "next-intl/server";
import { ARRIVAL, Reveal } from "@/shared/motion/reveal";
import { InteriorPageShell } from "@/shared/ui/interior-page-header";
import { AboutApproach } from "./about-approach";
import { AboutExperienceSection, type AboutMatter } from "./about-experience";
import { AboutHero } from "./about-hero";
import { AboutPeople, AboutWhy } from "./about-story";

export async function AboutPageContent() {
  const t = await getTranslations("about");
  const intro = t.raw("intro") as string[];
  const [introLead, ...practice] = intro;
  const matters = t.raw("experience.items") as AboutMatter[];
  const approach = t.raw("approach.paragraphs") as string[];
  const name = t.raw("name.paragraphs") as string[];
  const [opening, quote, founded, closing] = name;
  const people = t.raw("people.paragraphs") as string[];

  return (
    <InteriorPageShell className="overflow-hidden" contentClassName="pb-6 lg:pb-10">
      <AboutHero
        titleLead={t("titleLead")}
        titleTail={t("titleTail")}
        subtitle={t("subtitle")}
        lead={introLead}
        practice={practice}
      />
      <Reveal {...ARRIVAL}>
        <AboutExperienceSection
          titleLead={t("experience.titleLead")}
          titleTail={t("experience.titleTail")}
          items={matters}
        />
      </Reveal>
      <Reveal {...ARRIVAL} delay={0.08}>
        <AboutApproach
          titleLead={t("approach.titleLead")}
          titleTail={t("approach.titleTail")}
          paragraphs={approach}
        />
      </Reveal>
      <AboutWhy
        titleLead={t("name.titleLead")}
        titleTail={t("name.titleTail")}
        quote={quote}
        paragraphs={[opening, founded, closing].filter((item): item is string => Boolean(item))}
      />
      <AboutPeople
        lead={t("people.lead")}
        em={t("people.em")}
        tail={t("people.tail")}
        line2={t("people.line2")}
        paragraphs={people}
      />
    </InteriorPageShell>
  );
}
