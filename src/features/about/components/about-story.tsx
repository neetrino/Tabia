import Image from "next/image";
import { ABOUT_ASSETS } from "@/features/about/assets";
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
    <section className="mt-20 grid items-center gap-10 lg:mt-28 lg:grid-cols-2 lg:gap-x-12">
      <div>
        <h2 className="flex flex-wrap gap-x-[0.3em]">
          <AboutWord tone="light">{titleLead}</AboutWord>
          <AboutWord tone="heavy">{titleTail}</AboutWord>
        </h2>
        <AboutProse paragraphs={paragraphs} className="mt-8 max-w-[595px]" />
      </div>
      <div className="relative min-h-[420px] lg:min-h-[640px]">
        <Image
          src={ABOUT_ASSETS.whyChess}
          alt=""
          fill
          className="object-contain object-center"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        {quote ? (
          <p className="absolute bottom-6 right-0 max-w-[245px] text-right text-sm font-normal leading-[18.8px] text-white lg:bottom-16">
            {quote}
          </p>
        ) : null}
      </div>
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
      <div className="relative mx-auto h-[360px] w-full max-w-[420px] lg:h-[520px] lg:max-w-none">
        <Image
          src={ABOUT_ASSETS.peopleHand}
          alt=""
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 40vw, 80vw"
        />
      </div>
      <div className="lg:text-right">
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
      </div>
    </section>
  );
}
