/**
 * Convert an eval score from -5..+5 to a 0..100% scale for translate3d.
 * +5 => 0%, 0 => 50%, -5 => 100%
 */
export function scoreToPercent(score: number) {
  // Clamp to [-10, 10]
  const clamped = Math.max(-10, Math.min(10, score));

  // Now map [-10..+10] onto [100..0]
  //   -10 -> 100%
  //    0 -> 50%
  //   +10 -> 0%
  // This is just a linear transform.
  // An easy way: start at 50% and shift by 10% per point above or below zero:
  return 50 - clamped * 5;
}
