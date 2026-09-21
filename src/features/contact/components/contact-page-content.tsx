import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";

export async function ContactPageContent() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
        <p className="text-[var(--muted)]">{t("subtitle")}</p>
        <dl className="space-y-4 text-sm">
          <ContactDetail
            label={t("phone")}
            value={t("phoneValue")}
            href={`tel:${t("phoneValue").replace(/[^\d+]/g, "")}`}
          />
          <ContactDetail
            label={t("email")}
            value={t("emailValue")}
            href={`mailto:${t("emailValue")}`}
          />
          <ContactDetail label={t("address")} value={t("addressValue")} />
          <ContactDetail label={t("hours")} value={t("hoursValue")} />
        </dl>
      </div>
      <ContactForm />
    </div>
  );
}

function ContactDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="whitespace-pre-line text-[var(--muted)]">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
