"use client";

import { useEffect } from "react";
import { useSpring } from "motion/react";

export function useMockLoading() {
  const progress = useSpring(0, { stiffness: 300, damping: 40 });

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = progress.get() + Math.random() * 0.3;

      if (newProgress >= 1) {
        progress.set(1);
        clearInterval(interval);
      } else {
        progress.set(newProgress);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [progress]);

  return progress;
}
