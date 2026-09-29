import { staticImage } from "@/shared/config/static-image";

export const ABOUT_ASSETS = {
  scales: staticImage("about/scales.webp"),
  practicesPhoto: staticImage("about/practices-photo.webp"),
} as const;
