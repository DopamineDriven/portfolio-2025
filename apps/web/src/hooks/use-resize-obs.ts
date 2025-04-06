"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function useResizeObs<T extends HTMLDivElement | null>(
  elementRef: RefObject<T>
) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right
      });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef]);

  return dimensions;
}
