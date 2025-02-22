import { interpolate as d3Interpolate } from "d3";

/**
 * A piecewise function that:
 *   1) Interpolates from s0 to sMid (s2) for t ∈ [0..0.5]
 *   2) Interpolates from sMid to s1 for t ∈ [0.5..1]
 */
export function piecewiseScale(
  t: number,
  s0: number,
  sMid: number,
  s1: number
) {
  if (t < 0.5) {
    // Zoom out portion
    return d3Interpolate(s0, sMid)(t * 2);
  } else {
    // Zoom in portion
    return d3Interpolate(sMid, s1)((t - 0.5) * 2);
  }
}
