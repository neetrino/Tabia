import { getTranslations, setRequestLocale } from "next-intl/server";
import { Enter, Reveal } from "@/shared/motion/reveal";
import { revealDelay } from "@/shared/motion/timing";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const values = t.raw("values.items") as string[];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-16 md:px-6">
      <Enter>
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
          <p className="max-w-3xl text-lg text-[var(--muted)]">{t("intro")}</p>
        </header>
      </Enter>

      {[
        "history",
        "mission",
        "vision",
        "principles",
        "experience",
      ].map((section, index) => (
        <Reveal key={section} delay={revealDelay(index)}>
          <section className="space-y-3">
            <h2 className="text-2xl">{t(`${section}.title`)}</h2>
            <p className="max-w-3xl leading-relaxed text-[var(--muted)]">
              {t(`${section}.body`)}
            </p>
          </section>
        </Reveal>
      ))}

      <section className="space-y-4">
        <Reveal>
          <h2 className="text-2xl">{t("values.title")}</h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {values.map((value, index) => (
            <Reveal key={value} delay={revealDelay(index)}>
              <p className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-black/15 motion-reduce:transition-none">
                {value}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
