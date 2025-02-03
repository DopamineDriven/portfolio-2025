import { useCallback } from "react";

export function useCustomScroll() {
  const customEasing = useCallback((t: number): number => {
    // Incremental acceleration until 70% of the journey
    if (t < 0.7) {
      return t * t * t * t * t; // Quintic easing for acceleration
    }
    // Sudden deceleration followed by gradual slowdown
    else {
      return 1 - Math.pow(2, -10 * t + 7); // Exponential easing out for deceleration
    }
  }, []);

  const scrollToTop = useCallback(() => {
    const duration = 2500; // 2.5 seconds
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = customEasing(progress);
      const newScrollPosition = startPosition * (1 - easedProgress);

      window.scrollTo(0, newScrollPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we're at the very top
        window.scrollTo(0, 0);
      }
    };

    requestAnimationFrame(animate);
  }, [customEasing]);

  return { scrollToTop };
}
