"use client";

import { useCallback, useEffect, useState } from "react";

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleSize = useCallback(() => {
    if (typeof window === "undefined") return;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    setWindowSize(current => {
      if (current.width !== newWidth || current.height !== newHeight) {
        return { width: newWidth, height: newHeight };
      }
      return current;
    });
  }, []);

  useEffect(() => {
    handleSize();
    if (typeof window === "undefined") return;
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, [handleSize]);

  return windowSize;
}
