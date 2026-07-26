"use client";

import { useEffect, useState } from "react";

export function useViewportDimensions() {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
      // eslint-disable-next-line
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return dimensions ?? { width: 0, height: 0 };
}
