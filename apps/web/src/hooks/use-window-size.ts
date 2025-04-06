"use client";

import { useCallback, useEffect, useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    scrollY: 0
  });

  const handleSize = useCallback(() => {
    if (typeof window === "undefined") return;

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY
    });
  }, []);

  useEffect(() => {
    handleSize();

    if (typeof window === "undefined") return;

    window.addEventListener("resize", handleSize);
    window.addEventListener("scroll", handleSize);
    window.addEventListener("orientationchange", handleSize);

    return () => {
      window.removeEventListener("resize", handleSize);
      window.removeEventListener("scroll", handleSize);
      window.removeEventListener("orientationchange", handleSize);
    };
  }, [handleSize]);

  return windowSize;
}
