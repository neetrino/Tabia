import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const common = await getTranslations("common");

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
        <p className="text-[var(--muted)]">{t("subtitle")}</p>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold">{t("phone")}</dt>
            <dd className="text-[var(--muted)]">{t("phoneValue")}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t("email")}</dt>
            <dd className="text-[var(--muted)]">{t("emailValue")}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t("address")}</dt>
            <dd className="text-[var(--muted)]">{t("addressValue")}</dd>
          </div>
          <div>
            <dt className="font-semibold">{t("hours")}</dt>
            <dd className="text-[var(--muted)]">{t("hoursValue")}</dd>
          </div>
        </dl>
      </div>

      <form className="space-y-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="fullName">
            {t("form.fullName")}
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            {t("form.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="phone">
            {t("form.phone")}
          </label>
          <input
            id="phone"
            name="phone"
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="company">
            {t("form.company")}
          </label>
          <input
            id="company"
            name="company"
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="service">
            {t("form.service")}
          </label>
          <input
            id="service"
            name="service"
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="message">
            {t("form.message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
        >
          {common("actions.submit")}
        </button>
      </form>
    </div>
  );
}
