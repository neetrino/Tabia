"use client";

import type { ReactNode } from "react";
import { motion, MotionConfig } from "motion/react";
import { cn } from "@/shared/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -8% 0px" } as const;

type ShiftProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  /** Start scale. Settles to 1. Omit to skip scale. */
  scale?: number;
};

type Shown = {
  opacity: number;
  x: number;
  y: number;
  scale: number;
};

/** Respects the OS reduced-motion setting for every public-site animation. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Plays as soon as the element mounts. Use for the first screen. */
export function Enter(props: ShiftProps) {
  return <Shift {...props} mode="mount" />;
}

/** Plays once, when the element scrolls into view. */
export function Reveal(props: ShiftProps) {
  return <Shift {...props} mode="view" />;
}

/** Slow vertical float for decorative artwork. */
export function Drift({
  children,
  className,
  distance = 12,
  duration = 8,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={cn("motion-drift", className)}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Fade used when a route segment mounts. */
export function PageEnter({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="motion-reveal"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Shift({
  children,
  className,
  delay = 0,
  y = 22,
  x = 0,
  scale,
  mode,
}: ShiftProps & { mode: "mount" | "view" }) {
  const shown: Shown = { opacity: 1, x: 0, y: 0, scale: 1 };
  const hidden: Shown = { opacity: 0, x, y, scale: scale ?? 1 };

  return (
    <motion.div
      className={cn("motion-reveal", className)}
      initial={hidden}
      animate={mode === "mount" ? shown : undefined}
      whileInView={mode === "view" ? shown : undefined}
      viewport={mode === "view" ? VIEWPORT : undefined}
      transition={{ duration: 0.72, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
