import Image from "next/image";
import { ABOUT_ASSETS, WORK_ICONS } from "@/features/about/assets";
import { cn } from "@/shared/lib/cn";
import { AboutWord } from "./about-type";

/** Tilt and placement of each How we work icon, matching the Figma cards. */
const WORK_POSES = [
  "left-8 top-[32px] w-[164px] -rotate-[16deg] lg:left-10 lg:w-[186px]",
  "left-7 top-[30px] w-[156px] -rotate-[14deg] lg:left-8 lg:w-[176px]",
  "left-[42px] top-10 w-[150px] -rotate-[44deg] lg:left-12 lg:w-[160px]",
] as const;

/** Three numbered notes under How we work. */
export function AboutApproach({
  titleLead,
  titleTail,
  paragraphs,
}: {
  titleLead: string;
  titleTail: string;
  paragraphs: string[];
}) {
  return (
    <section className="mt-20 lg:mt-28">
      <h2 className="flex flex-wrap gap-x-[0.3em] lg:justify-end">
        <AboutWord tone="heavy">{titleLead}</AboutWord>
        <AboutWord tone="light">{titleTail}</AboutWord>
      </h2>
      <div className="mt-8 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-[22px]">
        {paragraphs.map((paragraph, index) => (
          <AboutWorkCard
            key={paragraph}
            body={paragraph}
            icon={WORK_ICONS[index] ?? WORK_ICONS[0]}
            pose={WORK_POSES[index] ?? WORK_POSES[0]}
            number={String(index + 1).padStart(2, "0")}
          />
        ))}
      </div>
    </section>
  );
}

function AboutWorkCard({
  body,
  icon,
  pose,
  number,
}: {
  body: string;
  icon: string;
  pose: string;
  number: string;
}) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[14px] bg-[#eaeaea]">
      <Image
        src={ABOUT_ASSETS.cardGlow}
        alt=""
        width={269}
        height={351}
        unoptimized
        className="pointer-events-none absolute bottom-0 right-0 h-[351px] w-[269px]"
      />
      <div className="relative h-[252px] shrink-0 lg:h-[276px]">
        <Image
          src={icon}
          alt=""
          width={280}
          height={280}
          className={cn("absolute max-w-none object-contain", pose)}
        />
        <p className="absolute right-5 top-3 text-[56px] font-extralight uppercase leading-none tracking-[-1.8px] text-[#bdbdbd] lg:right-7 lg:top-6 lg:text-[72px] lg:leading-[70px]">
          {number}
        </p>
      </div>
      <p className="relative px-6 pb-6 text-base font-light leading-normal text-[#090909] lg:px-8 lg:pb-8">
        {body}
      </p>
    </article>
  );
}
