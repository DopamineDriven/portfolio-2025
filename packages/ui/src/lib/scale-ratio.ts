export type ScaledRatio = {
  w: number;
  h: number;
};

/**
 * Applies logarithmic compression to an aspect ratio.
 * Preserves relative visual differences while preventing extreme shapes.
 *
 * maxVisualRatio - maximum visual spread (caps how extreme shapes can get)
 *
 *
 * compressionPow - lower = more compression at extremes
 */
export function scaleRatio(
  w: number,
  h: number,
  maxVisualRatio = 3.5,
  compressionPow = 0.65
) {
  const ratio = w / h;

  if (ratio === 1) {
    return { w: 1, h: 1 };
  }

  // Apply logarithmic compression
  const logRatio = Math.log(ratio);
  const scaledLog =
    Math.sign(logRatio) * Math.pow(Math.abs(logRatio), compressionPow);
  const visualRatio = Math.exp(scaledLog);

  // Clamp to maximum visual spread
  const clampedRatio = Math.max(
    1 / maxVisualRatio,
    Math.min(maxVisualRatio, visualRatio)
  );

  if (clampedRatio >= 1) {
    return { w: clampedRatio, h: 1 };
  } else {
    return { w: 1, h: 1 / clampedRatio };
  }
}

export function gcd(a: number, b: number) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}
/**
 * Parses a ratio string (e.g., "16:9", "1024x1536") into width and height.
 */
export function parseRatio(value: string) {
  if (value === "auto") {
    return { w: 1, h: 1 };
  }

  // Parse "W:H" format
  if (value.includes(":")) {
    const [w, h] = value.split(":").map(n => Number.parseFloat(n));
    if (w && h && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      return { w, h };
    }
  }

  // Parse "WxH" pixel format
  if (value.includes("x")) {
    const [w, h] = value.split("x").map(v => Number.parseFloat(v));
    if (w && h && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      // Simplify using GCD
      const divisor = gcd(w, h);
      return { w: w / divisor, h: h / divisor };
    }
  }

  return null;
}

/**
 * Parses a ratio string and applies visual scaling.
 * Returns scaled dimensions suitable for SVG viewBox rendering.
 */
export function parseAndScaleRatio(value: string) {
  const parsed = parseRatio(value);
  if (!parsed) {
    return { w: 1, h: 1 } satisfies ScaledRatio;
  }
  return scaleRatio(parsed.w, parsed.h) satisfies ScaledRatio;
}
