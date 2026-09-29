import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ABOUT_ASSETS, PRACTICE_ICONS } from "@/features/about/assets";
import { Reveal } from "@/shared/motion/reveal";
import { ButtonArrow } from "@/shared/ui/button-link";

export type AboutPractice = {
  title: string;
  body: string;
};

type AboutPracticesProps = {
  title: string;
  subtitle: string;
  more: string;
  items: AboutPractice[];
};

export function AboutPractices({ title, subtitle, more, items }: AboutPracticesProps) {
  return (
    <section className="mt-16 lg:mt-24">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,561px)_minmax(0,1fr)] lg:gap-x-16">
        <AboutPracticesMedia title={title} subtitle={subtitle} more={more} />
        <div className="lg:pt-8">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04} y={12}>
              <AboutPracticeRow
                item={item}
                icon={PRACTICE_ICONS[index] ?? ABOUT_ASSETS.iconGavel}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPracticesMedia({
  title,
  subtitle,
  more,
}: {
  title: string;
  subtitle: string;
  more: string;
}) {
  return (
    <div>
      <Reveal>
        <h2 className="text-[36px] font-bold leading-10 text-[#1a1a1a]">{title}</h2>
        <p className="mt-3 max-w-[384px] text-sm leading-5 text-[#6b7280]">{subtitle}</p>
      </Reveal>
      <Reveal delay={0.08} className="mt-8">
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={ABOUT_ASSETS.practicesPhoto}
            alt=""
            width={636}
            height={795}
            className="h-[420px] w-full object-cover object-left lg:h-[658px]"
            sizes="(min-width: 1024px) 561px, 100vw"
          />
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <Link
          href="/services"
          className="mt-8 inline-flex h-14 items-center gap-3 rounded-full border border-[#111827] px-8 text-base font-semibold tracking-[0.3px] text-[#151515] transition-colors hover:bg-[#151515] hover:text-white"
        >
          {more}
          <ButtonArrow />
        </Link>
      </Reveal>
    </div>
  );
}

function AboutPracticeRow({ item, icon }: { item: AboutPractice; icon: string }) {
  return (
    <article className="flex items-start gap-6 border-b border-[#e5e7eb] py-3.5">
      <Image
        src={icon}
        alt=""
        width={85}
        height={73}
        className="h-[73px] w-[85px] shrink-0 object-contain"
      />
      <div className="min-w-0 pt-1">
        <h3 className="text-sm font-bold uppercase leading-4 text-[#191919]">{item.title}</h3>
        <p className="mt-2 text-sm font-light leading-[21px] text-[#121212]">{item.body}</p>
      </div>
    </article>
  );
}
