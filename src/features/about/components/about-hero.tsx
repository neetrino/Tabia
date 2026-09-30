import Image from "next/image";
import { ABOUT_ASSETS } from "@/features/about/assets";
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
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.85fr)] lg:gap-8">
        <div>
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
        </div>
        <div className="relative -mr-5 h-[300px] lg:-mr-16 lg:h-[560px]">
          <Image
            src={ABOUT_ASSETS.heroKnight}
            alt=""
            fill
            priority
            className="object-contain object-center lg:object-right"
            sizes="(min-width: 1024px) 42vw, 90vw"
          />
        </div>
      </div>
      <div className="mt-4 grid items-center gap-8 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1fr)] lg:gap-x-10">
        <div className="relative mx-auto h-[260px] w-full max-w-[280px] lg:h-[340px] lg:max-w-none">
          <Image
            src={ABOUT_ASSETS.introQueen}
            alt=""
            fill
            className="object-contain object-left"
            sizes="320px"
          />
        </div>
        <AboutProse paragraphs={practice} className="max-w-[527px] lg:justify-self-end" />
      </div>
    </section>
  );
}
