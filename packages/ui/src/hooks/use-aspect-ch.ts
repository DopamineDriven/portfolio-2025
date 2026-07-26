"use client";

import { useEffect, useRef, useState } from "react";

export function useAspectCh({
  baseChars,
  minAspectRatio,
  maxAspectRatio,
  maxExtraChars
}: {
  baseChars: number;
  minAspectRatio: number;
  maxAspectRatio: number;
  maxExtraChars: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [chars, setChars] = useState(baseChars);

  useEffect(() => {
    if (!ref.current) return;

    const computeChUnits = (width: number, height: number) => {
      const aspectRatio = width / height;

      // Normalize into [0…1] range
      const t =
        (aspectRatio - minAspectRatio) / (maxAspectRatio - minAspectRatio);
      const clamped = Math.max(0, Math.min(1, t));

      // Map into [0…maxExtraChars] and round to whole characters
      const extra = Math.round(clamped * maxExtraChars);

      return baseChars + extra;
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const newChars = computeChUnits(width, height);
          setChars(newChars);
        }
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [baseChars, minAspectRatio, maxAspectRatio, maxExtraChars]);

  return { ref, chars };
}
