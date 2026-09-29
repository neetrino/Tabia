export const ABOUT_ASSETS = {
  scales: "/images/about/scales.png",
  practicesPhoto: "/images/about/practices-photo.png",
  iconBank: "/images/about/icon-bank.png",
  iconResources: "/images/about/icon-resources.png",
  iconDocument: "/images/about/icon-document.png",
  iconGavel: "/images/about/icon-gavel.png",
} as const;

/** Icon per practice row, in the order of Figma section 91:881. */
export const PRACTICE_ICONS = [
  ABOUT_ASSETS.iconBank,
  ABOUT_ASSETS.iconResources,
  ABOUT_ASSETS.iconDocument,
  ABOUT_ASSETS.iconGavel,
  ABOUT_ASSETS.iconGavel,
  ABOUT_ASSETS.iconGavel,
  ABOUT_ASSETS.iconGavel,
] as const;
