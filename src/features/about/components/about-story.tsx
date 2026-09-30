import Image from "next/image";
import { ABOUT_ASSETS } from "@/features/about/assets";
import { ARRIVAL, Reveal, ScrollSlide } from "@/shared/motion/reveal";
import { AboutProse, AboutWord } from "./about-type";

/** Why TABIA, with the chess definition set on the photograph. */
export function AboutWhy({
  titleLead,
  titleTail,
  quote,
  paragraphs,
}: {
  titleLead: string;
  titleTail: string;
  quote?: string;
  paragraphs: string[];
}) {
  return (
    <section className="relative mt-20 lg:mt-28 lg:min-h-[660px]">
      <Reveal {...ARRIVAL} className="lg:max-w-[560px] lg:pt-6">
        <h2 className="flex flex-wrap gap-x-[0.3em]">
          <AboutWord tone="light">{titleLead}</AboutWord>
          <AboutWord tone="heavy">{titleTail}</AboutWord>
        </h2>
        <AboutProse paragraphs={paragraphs} className="mt-8 max-w-[595px]" />
      </Reveal>
      <WhyBoard quote={quote} />
    </section>
  );
}

/** People and principles, with the headline aligned to the right on wide screens. */
export function AboutPeople({
  lead,
  em,
  tail,
  line2,
  paragraphs,
}: {
  lead: string;
  em: string;
  tail: string;
  line2: string;
  paragraphs: string[];
}) {
  return (
    <section className="mt-16 grid items-center gap-10 lg:mt-8 lg:grid-cols-2 lg:gap-x-16">
      <PeopleKings />
      <Reveal {...ARRIVAL} className="lg:text-right" delay={0.08}>
        <h2 className="flex flex-col lg:items-end">
          <span className="flex flex-wrap gap-x-[0.3em] lg:justify-end">
            <AboutWord tone="light">{lead}</AboutWord>
            <AboutWord tone="heavy">{em}</AboutWord>
            <AboutWord tone="light">{tail}</AboutWord>
          </span>
          <AboutWord tone="heavy">{line2}</AboutWord>
        </h2>
        <AboutProse
          paragraphs={paragraphs}
          className="mt-8 lg:ml-auto lg:max-w-[657px]"
        />
      </Reveal>
    </section>
  );
}

/** Hand and kings, cropped and bled 37px off the left edge as in Figma 134:35. */
function PeopleKings() {
  return (
    <Reveal
      {...ARRIVAL}
      x={-240}
      y={0}
      className="relative -ml-[calc(1.25rem+37px)] aspect-[672/696] w-[calc(100%+1.25rem+37px)] overflow-hidden lg:-ml-[calc(max(4rem,(var(--desktop-canvas-width,100vw)-1400px)/2+4rem)+37px)] lg:aspect-auto lg:h-[696px] lg:w-[672px]"
    >
      <Image
        src={ABOUT_ASSETS.peopleHand}
        alt=""
        fill
        className="object-cover object-[60%_center]"
        sizes="(min-width: 1024px) 672px, 100vw"
      />
    </Reveal>
  );
}

/** Side-on chessboard, flush with the right edge of the page. */
function WhyBoard({ quote }: { quote?: string }) {
  return (
    <ScrollSlide
      fromX={280}
      className="relative mt-10 -mr-5 w-[calc(100%+1.25rem)] lg:absolute lg:bottom-0 lg:right-[calc((1400px-100vw)/2-4rem)] lg:mr-0 lg:mt-0 lg:w-[min(825px,58vw)]"
    >
      <Image
        src={ABOUT_ASSETS.whyChess}
        alt=""
        width={1402}
        height={1122}
        className="h-auto w-full"
        sizes="(min-width: 1024px) 825px, 100vw"
      />
      {quote ? (
        <p className="absolute bottom-[14%] right-[7%] max-w-[245px] text-right text-sm font-normal leading-[18.8px] text-white">
          {quote}
        </p>
      ) : null}
    </ScrollSlide>
  );
}
