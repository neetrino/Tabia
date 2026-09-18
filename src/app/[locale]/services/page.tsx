import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { getPublishedServices } from "@/features/services";
import { ButtonLink } from "@/shared/ui/button-link";
import { CoverMedia } from "@/shared/ui/cover-media";
import { EmptyState } from "@/shared/ui/empty-state";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const items = await getPublishedServices(locale);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-16 md:px-6">
      <header className="space-y-4">
        <h1 className="text-4xl tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="max-w-2xl text-lg text-[var(--muted)]">{t("subtitle")}</p>
      </header>
      {items.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.slug}
              className="group border border-[var(--border)] bg-[var(--surface)]"
            >
              <CoverMedia
                src={item.imageUrl}
                alt={item.title}
                className="aspect-[16/9]"
              />
              <div className="space-y-3 p-6">
                <h2 className="text-2xl tracking-tight">{item.title}</h2>
                <p className="text-[var(--muted)]">{item.summary}</p>
                <ButtonLink href="/contact" variant="ghost">
                  {t("details")}
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
