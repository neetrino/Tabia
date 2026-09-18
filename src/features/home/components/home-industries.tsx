import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { INDUSTRY_ART } from "@/shared/config/content";
import { ButtonLink } from "@/shared/ui/button-link";
import { CoverMedia } from "@/shared/ui/cover-media";
import { SectionHeading } from "@/shared/ui/section-heading";

type IndustryItem = {
  id: string;
  name: string;
};

export async function HomeIndustries() {
  const t = await getTranslations("home");
  const common = await getTranslations("common");
  const industries = await getTranslations("industries");
  const items = industries.raw("items") as IndustryItem[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <SectionHeading
        eyebrow="03"
        title={t("industries.title")}
        action={
          <ButtonLink href="/industries" variant="ghost">
            {common("actions.viewAll")}
            <ArrowUpRight className="size-4" />
          </ButtonLink>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="group relative isolate">
            <Link href="/industries" className="block">
              <CoverMedia
                src={INDUSTRY_ART[item.id]}
                alt={item.name}
                className="aspect-[4/5]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--brand)]/80 via-transparent to-transparent" />
              <h3 className="absolute inset-x-0 bottom-0 p-5 text-lg text-white">
                {item.name}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
