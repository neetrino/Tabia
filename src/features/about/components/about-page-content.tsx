import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ABOUT_ASSETS } from "@/features/about/assets";
import { Enter } from "@/shared/motion/reveal";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";
import { AboutPractices, type AboutPractice } from "./about-practices";
import {
  AboutClose,
  AboutCopySection,
  AboutExperience,
  AboutName,
  AboutProse,
  type AboutMatter,
} from "./about-sections";

function AboutIntro({
  titleLead,
  titleTail,
  subtitle,
  lead,
  rest,
}: {
  titleLead: string;
  titleTail: string;
  subtitle: string;
  lead?: string;
  rest: string[];
}) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-x-16">
      <div>
        <InteriorPageHeader
          titleLead={titleLead}
          titleTail={titleTail}
          subtitle={subtitle}
          className="max-w-none"
        />
        {lead ? (
          <Enter delay={0.08}>
            <AboutProse paragraphs={[lead]} className="mt-8 lg:mt-10" />
          </Enter>
        ) : null}
      </div>
      <div>
        <Enter delay={0.1}>
          <Image
            src={ABOUT_ASSETS.scales}
            alt=""
            width={395}
            height={395}
            className="h-auto w-full max-w-[395px] object-contain"
            sizes="395px"
          />
        </Enter>
        {rest.length > 0 ? (
          <Enter delay={0.12}>
            <AboutProse paragraphs={rest} className="mt-8" />
          </Enter>
        ) : null}
      </div>
    </div>
  );
}

export async function AboutPageContent() {
  const t = await getTranslations("about");
  const common = await getTranslations("common");
  const intro = t.raw("intro") as string[];
  const [introLead, ...introRest] = intro;
  const matters = t.raw("experience.items") as AboutMatter[];
  const approach = t.raw("approach.paragraphs") as string[];
  const name = t.raw("name.paragraphs") as string[];
  const people = t.raw("people.paragraphs") as string[];
  const practices = t.raw("practices.items") as AboutPractice[];

  return (
    <>
      <InteriorPageShell className="pb-16 lg:pb-24">
        <AboutIntro
          titleLead={t("titleLead")}
          titleTail={t("titleTail")}
          subtitle={t("subtitle")}
          lead={introLead}
          rest={introRest}
        />
        <AboutPractices
          title={t("practices.title")}
          subtitle={t("practices.subtitle")}
          more={t("practices.more")}
          items={practices}
        />
        <AboutExperience title={t("experience.title")} items={matters} />
        <AboutCopySection title={t("approach.title")} paragraphs={approach} />
      </InteriorPageShell>
      <AboutName
        titleLead={t("name.titleLead")}
        titleTail={t("name.titleTail")}
        paragraphs={name}
      />
      <InteriorPageShell className="pt-16 lg:pt-24">
        <AboutCopySection
          title={t("people.title")}
          paragraphs={people}
          className="mt-0 border-t-0 pt-0 lg:mt-0 lg:pt-0"
        />
        <AboutClose body={t("cta")} action={common("actions.contactUs")} />
      </InteriorPageShell>
    </>
  );
}
