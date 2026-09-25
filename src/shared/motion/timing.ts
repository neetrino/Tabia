/** Stagger delay for lists. Caps so late items do not wait too long. */
export function revealDelay(index: number): number {
  return Math.min(index, 5) * 0.08;
}
