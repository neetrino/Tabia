import Image from "next/image";
import { ABOUT_ASSETS } from "@/features/about/assets";
import { ARRIVAL, Enter } from "@/shared/motion/reveal";
import { AboutProse, AboutWord } from "./about-type";

/** Opening of the About page: title, firm intro, and the two chess pieces. */
export function AboutHero({
  titleLead,
  titleTail,
  subtitle,
  lead,
  practice,
}: {
  titleLead: string;
  titleTail: string;
  subtitle: string;
  lead?: string;
  practice: string[];
}) {
  return (
    <section>
      <div className="relative lg:min-h-[380px]">
        <Enter {...ARRIVAL} y={16} className="lg:max-w-[520px]">
          <h1 className="flex flex-col">
            <AboutWord tone="heavy">{titleLead}</AboutWord>
            <AboutWord tone="light">{titleTail}</AboutWord>
          </h1>
          <p className="mt-6 max-w-[474px] text-base font-light uppercase leading-normal text-black">
            {subtitle}
          </p>
          {lead ? (
            <p className="mt-6 max-w-[513px] text-base font-light leading-normal text-black">
              {lead}
            </p>
          ) : null}
        </Enter>
        <HeroKnight />
      </div>
      <div className="mt-6 grid items-center gap-8 lg:mt-2 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1fr)] lg:gap-x-10">
        <IntroQueen />
        <Enter {...ARRIVAL} y={18} delay={0.2} className="lg:justify-self-end">
          <AboutProse
            paragraphs={practice}
            className="max-w-[527px] translate-y-3 lg:translate-y-8"
          />
        </Enter>
      </div>
    </section>
  );
}

/** Knight, nose intact, base flush with the right edge. */
function HeroKnight() {
  return (
    <Enter
      {...ARRIVAL}
      x={64}
      y={0}
      delay={0.12}
      className="mt-6 -mr-5 flex w-[calc(100%+1.25rem)] justify-end lg:absolute lg:right-[calc(-1*(4rem+max(0px,(var(--desktop-canvas-width,100vw)-1400px)/2)))] lg:top-0 lg:mt-0 lg:mr-0 lg:w-auto"
    >
      <Image
        src={ABOUT_ASSETS.heroKnight}
        alt=""
        width={1176}
        height={592}
        priority
        className="h-[168px] w-auto max-w-none lg:h-[370px]"
        sizes="(min-width: 1024px) 760px, 90vw"
      />
    </Enter>
  );
}

/** Queen crown, cropped so the base runs off the left edge. */
function IntroQueen() {
  return (
    <Enter
      {...ARRIVAL}
      x={-48}
      y={12}
      delay={0.16}
      className="-ml-5 translate-y-3 lg:-ml-[max(4rem,calc((var(--desktop-canvas-width,100vw)-1400px)/2+4rem))] lg:translate-y-10"
    >
      <Image
        src={ABOUT_ASSETS.introQueen}
        alt=""
        width={1029}
        height={526}
        className="h-[180px] w-auto max-w-none lg:h-[315px]"
        sizes="(min-width: 1024px) 700px, 90vw"
      />
    </Enter>
  );
}
