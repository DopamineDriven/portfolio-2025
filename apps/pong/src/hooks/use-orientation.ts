"use client";

import { useEffect, useState } from "react";

type Orientation = "portrait" | "landscape";

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [isLandscapeOptimal, setIsLandscapeOptimal] = useState(true);
  const [previousOrientation, setPreviousOrientation] =
    useState<Orientation | null>(null);

  useEffect(() => {
    // Function to check and update orientation
    const updateOrientation = () => {
      // Check if window exists (client-side)
      if (typeof window !== "undefined") {
        const isPortrait = window.innerHeight > window.innerWidth;
        const newOrientation = isPortrait ? "portrait" : "landscape";

        // Store previous orientation before updating
        if (orientation !== newOrientation) {
          setPreviousOrientation(orientation);
        }

        setOrientation(newOrientation);

        // For very small devices or unusual aspect ratios, we might need to adjust
        // what we consider "optimal" - here we're saying if width < 500px in landscape,
        // it's still not optimal
        const isOptimal = !isPortrait && window.innerWidth >= 500;
        setIsLandscapeOptimal(isOptimal);
      }
    };

    // Initial check
    updateOrientation();

    // Listen for resize and orientation change events
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, [orientation]);

  // Determine if orientation just changed from portrait to landscape
  const justRotatedToLandscape =
    previousOrientation === "portrait" && orientation === "landscape";

  return {
    orientation,
    isLandscapeOptimal,
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
    justRotatedToLandscape
  };
}
