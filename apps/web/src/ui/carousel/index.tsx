"use client";

import { useEffect, useRef } from "react";
import { ProficienciesCarousel } from "./proficiencies-carousel";

export function CarouselWithFade() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateFadeWidth = () => {
        const fadeWidth = window.innerWidth < 640 ? "5%" : "10%";
        container.style.setProperty("--fade-width", fadeWidth);
      };

      updateFadeWidth();
      window.addEventListener("resize", updateFadeWidth);
      return () => window.removeEventListener("resize", updateFadeWidth);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden" ref={containerRef}>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-[var(--fade-width)] bg-gradient-to-r to-transparent"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-[var(--fade-width)] bg-gradient-to-l to-transparent"></div>
        <ProficienciesCarousel />
      </div>
    </div>
  );
}
