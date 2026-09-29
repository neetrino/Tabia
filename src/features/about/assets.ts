import { staticImage } from "@/shared/config/static-image";

export const ABOUT_ASSETS = {
  scales: staticImage("about/scales.webp"),
  practicesPhoto: staticImage("about/practices-photo.webp"),
  iconBank: staticImage("about/icon-bank.webp"),
  iconResources: staticImage("about/icon-resources.webp"),
  iconDocument: staticImage("about/icon-document.webp"),
  iconGavel: staticImage("about/icon-gavel.webp"),
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
