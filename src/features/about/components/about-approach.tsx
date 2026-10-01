import Image from "next/image";
import { ABOUT_ASSETS, WORK_ICONS } from "@/features/about/assets";
import { cn } from "@/shared/lib/cn";
import { AboutWord } from "./about-type";

/** Placement of each How we work icon, from Figma frames 140:936, 140:939, and 140:940. */
const WORK_LAYOUT = [
  {
    frame: "left-0 -top-9 size-[200px] lg:-top-[50px] lg:size-[277px]",
    text: "pt-[156px] lg:pt-[236px]",
  },
  {
    frame: "left-0 -top-9 h-[196px] w-[168px] lg:-top-[49px] lg:h-[271px] lg:w-[232px]",
    text: "pt-[148px] lg:pt-[206px]",
  },
  {
    frame:
      "left-[-40px] -top-16 flex size-[240px] items-center justify-center lg:left-[-65px] lg:-top-[107px] lg:size-[405px]",
    image: "h-[164px] w-[154px] -rotate-[44.63deg] lg:h-[296px] lg:w-[277px]",
    text: "pt-[160px] lg:pt-[226px]",
  },
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
            layout={WORK_LAYOUT[index] ?? WORK_LAYOUT[0]}
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
  layout,
  number,
}: {
  body: string;
  icon: string;
  layout: (typeof WORK_LAYOUT)[number];
  number: string;
}) {
  return (
    <article className="relative flex h-full min-h-[360px] flex-col rounded-[14px] bg-[#eaeaea] lg:min-h-[416px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
        <Image
          src={ABOUT_ASSETS.cardGlow}
          alt=""
          width={269}
          height={351}
          unoptimized
          className="absolute bottom-0 right-0 h-[351px] w-[269px]"
        />
      </div>
      <WorkIcon icon={icon} layout={layout} />
      <p className="absolute right-5 top-4 text-[56px] font-light uppercase leading-none tracking-[-1.8px] text-[#bdbdbd] lg:right-[31px] lg:top-[27px] lg:text-[72px] lg:leading-[70px]">
        {number}
      </p>
      <p
        className={cn(
          "relative z-10 px-6 pb-8 text-base font-light leading-normal text-[#090909] lg:px-8 lg:pb-10",
          layout.text,
        )}
      >
        {body}
      </p>
    </article>
  );
}

function WorkIcon({
  icon,
  layout,
}: {
  icon: string;
  layout: (typeof WORK_LAYOUT)[number];
}) {
  if ("image" in layout) {
    return (
      <div className={cn("pointer-events-none absolute", layout.frame)}>
        <Image
          src={icon}
          alt=""
          width={277}
          height={296}
          className={cn("max-w-none object-cover", layout.image)}
        />
      </div>
    );
  }

  return (
    <Image
      src={icon}
      alt=""
      width={277}
      height={277}
      className={cn("pointer-events-none absolute max-w-none object-cover", layout.frame)}
    />
  );
}
