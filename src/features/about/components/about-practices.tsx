import Image from "next/image";
import { ABOUT_ASSETS } from "@/features/about/assets";
import { Reveal } from "@/shared/motion/reveal";
import { AboutExperience, AboutProse, type AboutMatter } from "./about-sections";

/** Photo beside the practice copy, with experience pulled up from below. */
export function AboutPractices({
  paragraphs,
  experienceTitle,
  matters,
}: {
  paragraphs: string[];
  experienceTitle: string;
  matters: AboutMatter[];
}) {
  if (paragraphs.length === 0 && matters.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 lg:mt-24">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:gap-x-14">
        <Reveal className="lg:col-start-2 lg:row-start-1">
          <AboutProse paragraphs={paragraphs} />
        </Reveal>
        <Reveal delay={0.08} className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div className="relative h-[420px] overflow-hidden rounded-3xl lg:aspect-[4/5] lg:h-auto">
            <Image
              src={ABOUT_ASSETS.practicesPhoto}
              alt=""
              fill
              className="object-cover object-[center_72%]"
              sizes="(min-width: 1024px) 520px, 100vw"
            />
          </div>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-start-2 lg:row-start-2">
          <AboutExperience title={experienceTitle} items={matters} />
        </Reveal>
      </div>
    </section>
  );
}
