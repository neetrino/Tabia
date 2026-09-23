import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HOME_ASSETS, SITE_SOCIAL } from "@/shared/config/content";
import { SiteBrand } from "@/shared/ui/site-brand";
import { cn } from "@/shared/lib/cn";

const links = [
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/team", key: "team" as const },
  { href: "/news", key: "news" as const },
  { href: "/insights", key: "insights" as const },
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
    <footer className="relative overflow-hidden border-t border-white/[0.26] bg-[#090909] text-[var(--nav)] lg:overflow-visible">
      <div className="pointer-events-none absolute left-[-34px] top-[156px] size-[470px] lg:bottom-0 lg:left-[calc(50%-5px)] lg:top-auto lg:z-20 lg:h-[580px] lg:w-[580px] lg:-translate-x-1/2">
        <Image
          src={HOME_ASSETS.footerKnight}
          alt=""
          fill
          className="object-contain lg:object-cover lg:object-center"
          sizes="(min-width: 1024px) 580px, 470px"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-[68px] pt-10 lg:px-16 lg:pb-10 lg:pt-12">
        <div className="lg:flex lg:min-h-[243px] lg:items-start lg:justify-between">
          <FooterIdentity
            brand={t("brand")}
            social={social}
            socialLabel={(id) => t(`footer.socialLabels.${id}`)}
            phoneLabel={contact("phone")}
            phone={contact("phoneValue")}
            emailLabel={contact("email")}
            email={contact("emailValue")}
            addressLabel={t("footer.office")}
            address={contact("addressValue")}
          />
          <div className="mt-6 grid grid-cols-2 gap-x-6 lg:mt-0 lg:block lg:w-full lg:max-w-[282px]">
            <FooterNav
              title={t("footer.navigation")}
              items={links.map((item) => ({
                href: item.href,
                label: t(`nav.${item.key}`),
              }))}
            />
            <FooterContact
              phoneLabel={contact("phone")}
              phone={contact("phoneValue")}
              emailLabel={contact("email")}
              email={contact("emailValue")}
              addressLabel={t("footer.office")}
              address={contact("addressValue")}
              className="self-center lg:hidden"
            />
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6 lg:mt-16 lg:pt-8">
          <p className="text-[10px] font-normal uppercase leading-[15px] text-white lg:w-fit lg:bg-[#090909] lg:text-xs lg:font-extralight lg:leading-[17px]">
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

function FooterContact({
  phoneLabel,
  phone,
  emailLabel,
  email,
  addressLabel,
  address,
  className,
}: {
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  className?: string;
}) {
  return (
    <address className={cn("flex flex-col items-end gap-4 text-right not-italic", className)}>
      <div>
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[1px] text-[var(--muted)]">
          {phoneLabel}
        </p>
        <a
          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
          className="mt-1 block text-[13px] leading-5 text-[var(--nav)]"
        >
          {phone}
        </a>
      </div>
      <div>
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[1px] text-[var(--muted)]">
          {emailLabel}
        </p>
        <a
          href={`mailto:${email}`}
          className="mt-1 block text-[13px] leading-5 text-[var(--nav)]"
        >
          {email}
        </a>
      </div>
      <div>
        <p className="text-[9px] uppercase leading-[13.5px] tracking-[1px] text-[var(--muted)]">
          {addressLabel}
        </p>
        <p className="mt-1 whitespace-pre-line text-[13px] leading-5 text-[var(--nav)]">{address}</p>
      </div>
    </address>
  );
}

type FooterSocial = {
  id: string;
  href: string;
  icon: string;
};

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

function FooterIdentity({
  brand,
  social,
  socialLabel,
  phoneLabel,
  phone,
  emailLabel,
  email,
  addressLabel,
  address,
}: {
  brand: string;
  social: FooterSocial[];
  socialLabel: (id: string) => string;
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
}) {
  return (
    <div className="flex w-full flex-col items-center lg:max-w-[392px] lg:items-start">
      <SiteBrand
        label={brand}
        className="[&_img]:h-[30px] [&_img]:w-[104px] lg:[&_img]:h-[38px] lg:[&_img]:w-[131px]"
      />
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
      <address className="hidden space-y-4 text-sm not-italic lg:block">
        <FooterFact label={phoneLabel} value={phone} />
        <FooterFact label={emailLabel} value={email} />
        <FooterFact label={addressLabel} value={address} multiline />
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
    <div className="w-full lg:max-w-[282px] lg:pt-[60px]">
      <p className="text-[9px] font-normal uppercase leading-[13.5px] tracking-[3px] text-[var(--muted)] lg:text-[10px] lg:font-semibold lg:leading-[15px]">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2 text-[13px] font-normal leading-5 lg:mt-6 lg:gap-3 lg:text-sm lg:font-light">
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
