import { getTranslations, setRequestLocale } from "next-intl/server";
import { INDUSTRY_ART } from "@/shared/config/content";
import { CoverMedia } from "@/shared/ui/cover-media";

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
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:px-6">
      <header className="space-y-3">
        <h1 className="text-4xl tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">{t("subtitle")}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
          >
            <CoverMedia
              src={INDUSTRY_ART[item.id]}
              alt={item.name}
              className="aspect-[16/8]"
            />
            <div className="p-6">
              <h2 className="text-xl tracking-tight">{item.name}</h2>
              <p className="mt-2 text-[var(--muted)]">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
