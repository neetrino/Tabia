import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = t.raw("values.items") as string[];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 md:px-6">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
        <p className="max-w-3xl text-lg text-[var(--muted)]">{t("intro")}</p>
      </header>

      {[
        "history",
        "mission",
        "vision",
        "principles",
        "experience",
      ].map((section) => (
        <section key={section} className="space-y-3">
          <h2 className="text-2xl">{t(`${section}.title`)}</h2>
          <p className="max-w-3xl leading-relaxed text-[var(--muted)]">
            {t(`${section}.body`)}
          </p>
        </section>
      ))}

      <section className="space-y-4">
        <h2 className="text-2xl">{t("values.title")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {values.map((value) => (
            <li
              key={value}
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              {value}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
