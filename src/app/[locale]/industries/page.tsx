import { getTranslations, setRequestLocale } from "next-intl/server";
import { INDUSTRY_ART } from "@/shared/config/content";
import { CoverMedia } from "@/shared/ui/cover-media";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";

type PageProps = { params: Promise<{ locale: string }> };

type IndustryItem = {
  id: string;
  name: string;
  description: string;
};

export default async function IndustriesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("industries");
  const items = t.raw("items") as IndustryItem[];

  return (
    <InteriorPageShell>
      <InteriorPageHeader
        titleLead={t("titleLead")}
        titleTail={t("titleTail")}
        subtitle={t("subtitle")}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-6">
        {items.map((item) => (
          <article
            key={item.id}
            className="group relative isolate overflow-hidden rounded-2xl bg-[#151515] lg:rounded-3xl"
          >
            <CoverMedia
              src={INDUSTRY_ART[item.id]}
              alt={item.name}
              className="aspect-[4/3] bg-[#1a1a1a] lg:aspect-[16/10]"
              imageClassName="opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7">
              <h2 className="text-lg font-semibold tracking-tight text-white lg:text-xl">
                {item.name}
              </h2>
              <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-white/75">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </InteriorPageShell>
  );
}
