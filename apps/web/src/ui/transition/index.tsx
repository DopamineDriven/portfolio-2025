"use client";

import type { Transition } from "motion/react";
import type React from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform
} from "motion/react";

// Simple in-memory cache to track visited routes
const visitedRoutes = new Set<string>();

function LoadingAnimation({ children }: { children: React.ReactNode }) {
  const progress = useMockLoading();
  const [isLoaded, setIsLoaded] = useState(false);

  const leftEdge = useMotionValue("calc(50% - 2px)");
  const rightEdge = useMotionValue("calc(50% + 2px)");
  const topEdge = useTransform(progress, [0, 1], ["50%", "0%"]);
  const bottomEdge = useTransform(progress, [0, 1], ["50%", "100%"]);

  /**
   * Ideally this would be as simple as something like inset() but this would leave
   * the bit in the middle visible, whereas we want to punch out the bit in the
   * middle and leave the rest. So to fix this we create a polygon that cuts into
   * the middle with a thin line and then opens that thin line once progress is 1
   */
  const clipPath = useMotionTemplate`polygon(
      0% 0%, ${leftEdge} 0%, ${leftEdge} ${topEdge}, ${leftEdge} ${bottomEdge}, ${rightEdge} ${bottomEdge}, ${rightEdge} ${topEdge},
      ${leftEdge} ${topEdge}, ${leftEdge} 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%
    )`;

  useMotionValueEvent(progress, "change", latest => {
    if (latest >= 1 && !isLoaded) {
      setIsLoaded(true);
    }
  });

  useEffect(() => {
    if (!isLoaded) return;

    const transition: Transition = {
      type: "spring",
      visualDuration: 0.5,
      bounce: 0
    };

    animate(leftEdge, "calc(0% - 0px)", transition);
    animate(rightEdge, "calc(100% + 0px)", transition);
  }, [isLoaded, leftEdge, rightEdge]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {children}
      <motion.div
        className="bg-foreground pointer-events-none fixed inset-0 z-[10000000000]"
        animate={{ opacity: isLoaded ? 0 : 1 }}
      />
      <motion.div
        className="bg-background pointer-events-none fixed inset-0 z-[10000000001] will-change-[clip-path]"
        style={{ clipPath }}
      />
    </div>
  );
}

export function Transition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = pathname + searchParams.toString();

  // Check if this route has been visited before
  const isRouteVisited = useRef(visitedRoutes.has(currentUrl));

  // Skip animation if route is already visited
  const shouldAnimate = !isRouteVisited.current;

  // Add current route to visited routes
  useEffect(() => {
    visitedRoutes.add(currentUrl);
  }, [currentUrl]);

  // If we shouldn't animate, just return children
  if (!shouldAnimate) {
    return (
      <Suspense>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </Suspense>
    );
  }

  // Otherwise, show the loading animation
  return (
    <Suspense>
      <LoadingAnimation>{children}</LoadingAnimation>
    </Suspense>
  );
}

/**
 * Mock loading hook to simulate a loading progress
 * Adjusted to be slightly slower for a better visual experience
 */
function useMockLoading() {
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
