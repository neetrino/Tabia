import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HOME_ASSETS, SITE_SOCIAL } from "@/shared/config/content";
import { SiteBrand } from "@/shared/ui/site-brand";

const links = [
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/industries", key: "industries" as const },
  { href: "/team", key: "team" as const },
  { href: "/news", key: "news" as const },
  { href: "/contact", key: "contact" as const },
];

const footerSocialIds = ["instagram", "facebook", "telegram"] as const;

export async function SiteFooter() {
  const t = await getTranslations("common");
  const contact = await getTranslations("contact");
  const year = new Date().getFullYear();
  const social = footerSocialIds.flatMap((id) => {
    const item = SITE_SOCIAL.find((entry) => entry.id === id);
    return item ? [{ id, href: item.href, icon: item.icon }] : [];
  });

  return (
    <footer className="relative border-t border-white/[0.26] bg-[#090909] text-[var(--nav)]">
      <div className="pointer-events-none absolute bottom-0 left-[calc(50%-5px)] size-[580px] -translate-x-1/2">
        <Image
          src={HOME_ASSETS.footerKnight}
          alt=""
          fill
          className="object-cover"
          sizes="580px"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-10 pt-12 lg:px-16">
        <div className="flex flex-col gap-12 lg:min-h-[243px] lg:flex-row lg:items-start lg:justify-between">
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
        <div className="mt-16 border-t border-white/5 pt-8">
          <p className="w-fit bg-[#090909] text-xs font-extralight uppercase leading-[17px] text-white">
            {t.rich("footer.copyright", {
              year,
              br: () => <br />,
              a: (chunks) => (
                <a
                  href="https://neetrino.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline-offset-2 hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterFact({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase leading-[15px] tracking-[1px] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={
          multiline
            ? "mt-1 whitespace-pre-line text-sm font-light leading-[22.75px] text-[var(--nav)]"
            : "mt-1 text-sm font-light leading-5 text-[var(--nav)]"
        }
      >
        {value}
      </p>
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
    <div className="w-full max-w-[392px]">
      <SiteBrand label={brand} />
      <ul className="flex h-[88px] items-center gap-4">
        {social.map((item) => (
          <li key={item.id}>
            {item.href ? (
              <a href={item.href} target="_blank" rel="noreferrer">
                <SocialMark icon={item.icon} label={socialLabel(item.id)} />
              </a>
            ) : (
              <SocialMark icon={item.icon} label={socialLabel(item.id)} />
            )}
          </li>
        ))}
      </ul>
      <address className="space-y-4 text-sm not-italic">
        <FooterFact label={phoneLabel} value={phoneValue} />
        <FooterFact label={emailLabel} value={emailValue} />
        <FooterFact label={officeLabel} value={officeValue} multiline />
      </address>
    </div>
  );
}

function SocialMark({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="grid size-10 place-items-center rounded-full bg-white">
      <img src={icon} alt={label} width={40} height={40} className="block size-10" />
    </span>
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
    <div className="w-full max-w-[282px] lg:pt-[60px]">
      <p className="text-[10px] font-semibold uppercase leading-[15px] tracking-[3px] text-[var(--muted)]">
        {title}
      </p>
      <ul className="mt-6 space-y-3 text-sm font-light leading-5">
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
