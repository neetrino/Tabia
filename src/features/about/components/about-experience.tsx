import Image from "next/image";
import { ABOUT_ASSETS } from "@/features/about/assets";
import { AboutWord } from "./about-type";

export type AboutMatter = {
  industry: string;
  title: string;
  body: string;
};

/** Representative matters beside the towers photograph. */
export function AboutExperienceSection({
  titleLead,
  titleTail,
  items,
}: {
  titleLead: string;
  titleTail: string;
  items: AboutMatter[];
}) {
  return (
    <section className="mt-20 lg:mt-28">
      <h2 className="flex flex-wrap gap-x-[0.3em]">
        <AboutWord tone="heavy">{titleLead}</AboutWord>
        <AboutWord tone="light">{titleTail}</AboutWord>
      </h2>
      <div className="mt-8 grid items-start gap-8 lg:mt-12 lg:grid-cols-[minmax(0,624px)_minmax(0,1fr)] lg:gap-x-12">
        <div className="overflow-hidden rounded-2xl bg-[#1a1a1a]">
          <Image
            src={ABOUT_ASSETS.experience}
            alt=""
            width={800}
            height={500}
            className="h-[280px] w-full object-cover opacity-70 lg:h-[468px]"
            sizes="(min-width: 1024px) 624px, 100vw"
          />
        </div>
        <div className="flex flex-col gap-10 lg:pt-2">
          {items.map((item) => (
            <AboutMatterBlock key={item.industry} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutMatterBlock({ item }: { item: AboutMatter }) {
  return (
    <article>
      <p className="inline-flex rounded-[20px] bg-[#a9000f] px-[15px] py-[5px] text-base font-normal text-[#fefefe]">
        {item.industry}
      </p>
      <h3 className="mt-4 text-lg font-semibold leading-normal text-[#090909]">
        {item.title}
      </h3>
      <p className="mt-3 max-w-[590px] text-base font-normal leading-normal text-[#090909]">
        {item.body}
      </p>
    </article>
  );
}
