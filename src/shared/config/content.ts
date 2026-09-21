export const HOME_SERVICES_LIMIT = 6;
export const HOME_TEAM_LIMIT = 7;
export const HOME_PUBLICATIONS_LIMIT = 4;

export const HOME_ASSETS = {
  heroChess: "/images/home/hero-chess.png",
  aboutBooks: "/images/home/about-books.png",
  serviceScales: "/images/home/service-scales.png",
  footerKnight: "/images/home/footer-knight.png",
  logo: "/images/brand/logo.svg",
  navHome: "/images/icons/nav-home.svg",
  serviceArrow: "/images/icons/service-arrow.svg",
  socialInstagram: "/images/icons/social-instagram.svg",
  socialFacebook: "/images/icons/social-facebook.svg",
  socialTelegram: "/images/icons/social-telegram.svg",
} as const;

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
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "",
    icon: HOME_ASSETS.socialFacebook,
  },
] as const;

export function getConfiguredSocialLinks() {
  return SITE_SOCIAL.filter((item) => item.href.length > 0);
}

export const INDUSTRY_ART: Record<string, string> = {
  corporate: "/images/industries/corporate.svg",
  employment: "/images/industries/employment.svg",
  tax: "/images/industries/tax.svg",
  disputes: "/images/industries/disputes.svg",
};
