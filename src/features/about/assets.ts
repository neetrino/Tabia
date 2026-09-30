import { staticImage } from "@/shared/config/static-image";

export const ABOUT_ASSETS = {
  heroKnight: staticImage("about/hero-knight-edge.webp"),
  introQueen: staticImage("about/intro-queen-side.webp"),
  experience: staticImage("about/experience-towers.webp"),
  workBriefcase: staticImage("about/work-01.webp"),
  workClipboard: staticImage("about/work-02.webp"),
  workHandshake: staticImage("about/work-03.webp"),
  whyChess: staticImage("about/why-board-side.webp"),
  peopleHand: staticImage("about/people-kings-figma.webp"),
  cardGlow: "/images/about/card-glow.svg",
} as const;

export const WORK_ICONS = [
  ABOUT_ASSETS.workBriefcase,
  ABOUT_ASSETS.workClipboard,
  ABOUT_ASSETS.workHandshake,
] as const;
