import { staticImage } from "@/shared/config/static-image";

export const HOME_SERVICES_LIMIT = 6;
export const HOME_TEAM_LIMIT = 7;
export const HOME_PUBLICATIONS_LIMIT = 4;

export const HOME_ASSETS = {
  heroChess: staticImage("home/hero-chess.webp"),
  aboutBooks: staticImage("home/about-books.webp"),
  serviceScales: staticImage("home/service-scales.webp"),
  footerKnight: staticImage("home/footer-knight.webp"),
  logo: "/images/brand/logo.svg",
  logoDark: "/images/brand/logo-dark.svg",
  navHome: "/images/icons/nav-home.svg",
  serviceArrow: "/images/icons/service-arrow.svg",
  socialInstagram: "/images/icons/social-instagram.svg",
  socialFacebook: "/images/icons/social-facebook.svg",
  socialTelegram: "/images/icons/social-telegram.svg",
  socialLinkedIn: "/images/icons/social-linkedin.svg",
} as const;

const OFFICE_MAP_QUERY = "25%20Sayat-Nova%20Avenue%2C%20Yerevan";

/** Yandex Maps search for the Yerevan office. */
export const OFFICE_MAP_HREF = `https://yandex.com/maps/?text=${OFFICE_MAP_QUERY}`;

/** Embedded Yandex map for the contact page. */
export const OFFICE_MAP_EMBED = `https://yandex.com/map-widget/v1/?text=${OFFICE_MAP_QUERY}&z=16`;

/** Per-slug illustration frames from the services section design. */
export const SERVICE_ILLUSTRATION_FRAME: Record<string, string> = {
  "corporate-advisory": "left-[153px] top-[42px] size-[302px]",
  "natural-resources": "left-[153px] top-[62px] size-[302px]",
  "tax-digital-strategy": "left-[100px] top-[23px] size-[368px]",
  "banking-finance": "left-[88px] top-[100px] h-[240px] w-[360px]",
  "aml-compliance": "left-[130px] top-[23px] size-[366px]",
  "criminal-advisory":
    "left-[25.37%] right-[-14.39%] top-[62px] aspect-[1402/1122]",
};

export const SITE_SOCIAL = [
  {
    id: "instagram" as const,
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "",
    icon: HOME_ASSETS.socialInstagram,
  },
  {
    id: "facebook" as const,
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "",
    icon: HOME_ASSETS.socialFacebook,
  },
  {
    id: "telegram" as const,
    href: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM ?? "",
    icon: HOME_ASSETS.socialTelegram,
  },
  {
    id: "linkedin" as const,
    href:
      process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ||
      "https://www.linkedin.com/company/tabia-legal-solutions/",
    icon: HOME_ASSETS.socialLinkedIn,
  },
] as const;

export function getConfiguredSocialLinks() {
  return SITE_SOCIAL.filter((item) => item.href.length > 0);
}
