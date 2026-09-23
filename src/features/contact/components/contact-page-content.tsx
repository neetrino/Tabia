import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";

export async function ContactPageContent() {
  const t = await getTranslations("contact");

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-16 lg:px-16 lg:pb-32 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12 xl:gap-16">
          <div>
            <h1 className="max-w-[420px] text-[36px] uppercase leading-[44px] text-[#0a0a0a] lg:max-w-[520px] lg:text-[56px] lg:leading-[56px]">
              <span className="block font-semibold lg:font-extrabold">
                {t("titleLead")}
              </span>
              <span className="mt-[7px] block font-light text-[#0a0a0a]/80 lg:mt-[9px] lg:font-extralight">
                {t("titleTail")}
              </span>
            </h1>
            <p className="mt-6 max-w-[360px] text-[11px] uppercase leading-[18px] tracking-[0.35px] text-[#0a0a0a]/70 lg:mt-8 lg:max-w-[420px] lg:text-sm lg:leading-[21px]">
              {t("subtitle")}
            </p>

            <dl className="mt-10 grid gap-7 border-t border-black/10 pt-8 sm:grid-cols-2 lg:mt-14 lg:max-w-[560px] lg:gap-9">
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
      </div>
    </section>
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
      <dt className="text-xs font-medium uppercase leading-4 tracking-[1px] text-[var(--muted)]">
        {label}
      </dt>
      <dd className="mt-2 whitespace-pre-line text-base font-light leading-6 text-[#0a0a0a]">
        {href ? (
          <a
            href={href}
            className="transition-colors duration-300 hover:text-[var(--brand)]"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
