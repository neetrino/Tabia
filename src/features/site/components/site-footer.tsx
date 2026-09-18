import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  HOME_ASSETS,
  getConfiguredSocialLinks,
} from "@/shared/config/content";
import { SiteBrand } from "@/shared/ui/site-brand";

const links = [
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/industries", key: "industries" as const },
  { href: "/team", key: "team" as const },
  { href: "/news", key: "news" as const },
  { href: "/contact", key: "contact" as const },
];

const footerSocialIds = new Set(["instagram", "facebook", "telegram"]);

export async function SiteFooter() {
  const t = await getTranslations("common");
  const contact = await getTranslations("contact");
  const year = new Date().getFullYear();
  const social = getConfiguredSocialLinks()
    .filter((item) => footerSocialIds.has(item.id))
    .map((item) => ({ id: item.id, href: item.href, icon: item.icon }));

  return (
    <footer className="relative overflow-hidden border-t border-white/25 bg-[var(--ink)] text-[var(--nav)]">
      <div className="pointer-events-none absolute left-1/2 top-[-79px] size-[572px] -translate-x-1/2">
        <Image
          src={HOME_ASSETS.footerKnight}
          alt=""
          fill
          className="object-cover"
          sizes="572px"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-10 pt-20 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
          <FooterIdentity
            brand={t("brand")}
            social={social}
            socialLabel={(id) => t(`footer.socialLabels.${id}`)}
            phoneLabel={contact("phone")}
            phoneValue={contact("phoneValue")}
            emailLabel={contact("email")}
            emailValue={contact("emailValue")}
            officeLabel={t("footer.office")}
            officeValue={contact("addressValue")}
          />
          <FooterNav
            title={t("footer.navigation")}
            items={links.map((item) => ({
              href: item.href,
              label: t(`nav.${item.key}`),
            }))}
          />
        </div>
        <p className="mt-16 border-t border-white/5 pt-8 text-xs font-extralight uppercase text-white">
          {t("footer.copyright", {
            year,
            company: t("footer.createdBy"),
          })}
        </p>
      </div>
    </footer>
  );
}

function FooterFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[1px] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm font-light text-[var(--nav)]">{value}</p>
    </div>
  );
}

type FooterSocial = {
  id: string;
  href: string;
  icon: string;
};

function FooterIdentity({
  brand,
  social,
  socialLabel,
  phoneLabel,
  phoneValue,
  emailLabel,
  emailValue,
  officeLabel,
  officeValue,
}: {
  brand: string;
  social: FooterSocial[];
  socialLabel: (id: string) => string;
  phoneLabel: string;
  phoneValue: string;
  emailLabel: string;
  emailValue: string;
  officeLabel: string;
  officeValue: string;
}) {
  return (
    <div className="max-w-sm space-y-6">
      <SiteBrand label={brand} />
      {social.length > 0 ? (
        <ul className="flex gap-4">
          {social.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer">
                <img src={item.icon} alt={socialLabel(item.id)} />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <address className="space-y-4 text-sm not-italic">
        <FooterFact label={phoneLabel} value={phoneValue} />
        <FooterFact label={emailLabel} value={emailValue} />
        <FooterFact label={officeLabel} value={officeValue} />
      </address>
    </div>
  );
}

function FooterNav({
  title,
  items,
}: {
  title: string;
  items: { href: (typeof links)[number]["href"]; label: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[var(--muted)]">
        {title}
      </p>
      <ul className="mt-6 space-y-3 text-sm font-light">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
