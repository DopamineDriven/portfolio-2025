"use client";

import { useCallback } from "react";

export const useBackToTopScroll = () => {
  const scrollToTop = useCallback(() => {
    // get scrollY
    const start = window.scrollY || document.documentElement.scrollTop;
    if (start === 0) return;

    const startTime = performance.now();
    function step(currentTime: number) {
      // get normalized elapsed time (n ranges from 0 to 1)
      const elapsed = currentTime - startTime;
      let n = elapsed / 2000;
      if (n > 1) n = 1; // Clamp to 1 at the end

      // Calculate progress based on multi–phase easing:
      let progress: number;
      if (n <= 0.33) {
        // (0–33%): Rapid acceleration (easeInQuad)
        const u = n / 0.33; // Normalize to 0-1
        progress = 0.33 * (u * u);
      } else if (n <= 0.6) {
        // (33–60%): Sudden deceleration (easeOutQuad)
        const u = (n - 0.33) / 0.27; // Map to 0-1
        progress = 0.33 + 0.27 * (1 - Math.pow(1 - u, 2));
      } else if (n <= 0.95) {
        // (60–95%): Rapid acceleration again (easeInQuad)
        const u = (n - 0.6) / 0.35; // Map to 0-1
        progress = 0.6 + 0.35 * (u * u);
      } else {
        // (95–100%): Smooth final easing (easeOutQuad)
        const u = (n - 0.95) / 0.05; // Map to 0-1
        progress = 0.95 + 0.05 * (1 - Math.pow(1 - u, 2));
      }

      // Compute the new scroll position.
      const newScroll = start * (1 - progress);
      window.scrollTo(0, newScroll);

      // Continue the animation until complete.
      if (n < 1) {
        requestAnimationFrame(step);
      }
    }

    // Start the animation.
    requestAnimationFrame(step);
  }, []);
  return scrollToTop;
};
