"use client";

import { useRef, type ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/shared/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Slow enough that the motion is still playing as the block comes into view. */
export const ARRIVAL = {
  duration: 4.4,
  ease: [0.33, 0, 0.2, 1],
  margin: "0px 0px 40% 0px",
} as const;

const VIEWPORT = { once: true, margin: "0px 0px -8% 0px" } as const;

type ShiftProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Seconds. Defaults to the site reveal. */
  duration?: number;
  /** Cubic bezier. Defaults to the site ease. */
  ease?: readonly [number, number, number, number];
  /** When to start a scroll reveal. A positive bottom margin starts it before the block is on screen. */
  margin?: string;
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

/** Gentle S-curve. The middle never speeds up the way a cubic ease does. */
function glide(progress: number): number {
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

/**
 * Horizontal slide driven by scroll position.
 * Starts only once the block reaches the viewport, and eases in with the scroll.
 */
export function ScrollSlide({
  children,
  className,
  fromX,
}: {
  children: ReactNode;
  className?: string;
  /** Offset, in px, before the block has entered. Positive comes from the right. */
  fromX: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const shifted = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : fromX, 0], {
    ease: glide,
  });
  const smooth = useSpring(shifted, { stiffness: 52, damping: 22, mass: 0.6, restDelta: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="motion-reveal will-change-transform"
        style={{ x: reduceMotion ? shifted : smooth }}
      >
        {children}
      </motion.div>
    </div>
  );
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
  duration = 0.72,
  ease = EASE,
  margin,
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
      viewport={mode === "view" ? { once: true, margin: margin ?? VIEWPORT.margin } : undefined}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
