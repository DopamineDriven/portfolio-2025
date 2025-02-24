"use client";

import type { FC } from "react";
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useWorldTour } from "@/hooks/use-world-tour";
import { cn } from "@/lib/utils";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import { WorldCountryFlagCounts } from "@/ui/world-tour/world-country-flag-counts";

const visitorData = [
  ["840", 104],
  ["250", 11],
  ["484", 9],
  ["056", 5],
  ["156", 4],
  ["616", 2],
  ["642", 2],
  ["756", 1],
  ["376", 1],
  ["364", 1]
] as const satisfies readonly [string, number][];

const WorldTour: FC = () => {
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);

  const { containerRef, currentCountry, currentVisitors } = useWorldTour({
    visitorData
  });

  return (
    <div className="bg-background w-full sm:space-y-2">
      <AnimatePresence mode="popLayout">
        <div className="mx-auto w-full justify-center">
          <div className="relative isolate mx-auto mt-0 flex w-full flex-row justify-start px-0">
            <div className="absolute inset-0 bg-[oklch(0.1370608055115447_0.03597153479968494_258.52581130794215)]/30 backdrop-blur-sm"></div>
            <motion.div
              key={currentCountry.countryName}
              className="motion-ease-in-out-quad relative z-10 flex transform items-start justify-center sm:items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2,
                  type: "spring",
                  visualDuration: 0.3,
                  bounce: 0.4,
                  damping: 50
                }
              }}
              exit={{ opacity: 0, x: -50 }}>
              <WorldCountryFlagCounts
                countryName={currentCountry.countryName}
                flagUrl={currentCountry.countryFlag}
                visitors={currentVisitors}
                flagAspectRatio={currentCountry.flagAspectRatio}
              />
            </motion.div>
          </div>
          <BreakoutWrapper>
            <div className="mx-auto max-w-5xl">
              <div className="relative flex h-auto min-w-screen items-center justify-center sm:min-h-[60vh] sm:min-w-full">
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-[10%] left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-full bg-gradient-to-bl from-black/10 via-black/[0.25] to-black/30 mix-blend-soft-light blur-sm sm:bottom-[5%]"
                  )}></div>
                <motion.div
                  ref={containerRef}
                  className="relative top-1/2 bottom-1/2 z-10 mx-auto flex aspect-[3/4] h-auto w-full items-center justify-center align-middle drop-shadow-sm sm:aspect-[4/3]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}>
                  <svg ref={d3ContainerRef} className="h-full w-full" />
                </motion.div>
              </div>
            </div>
          </BreakoutWrapper>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default WorldTour;
