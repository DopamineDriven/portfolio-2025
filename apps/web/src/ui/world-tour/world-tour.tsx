"use client";

import type { FC } from "react";
import { useRef } from "react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useWorldTour } from "@/hooks/use-world-tour";
import { cn } from "@/lib/utils";
import { BreakoutWrapper } from "@/ui/atoms/breakout-wrapper";
import StarFieldBackground from "@/ui/world-tour/star-field-background";
import { WorldCountryFlagCounts } from "@/ui/world-tour/world-country-flag-counts";
import { AnimatePresence, motion } from "motion/react";

const visitorData = [
  ["840", 432],
  ["702", 408],
  ["156", 174],
  ["643", 27],
  ["344", 21],
  ["484", 16],
  ["276", 11],
  ["356", 11],
  ["704", 7],
  ["036", 6],
  ["250", 6],
  ["826", 6],
  ["792", 6],
  ["076", 5],
  ["124", 5],
  ["804", 5],
  ["360", 4],
  ["392", 4],
  ["372", 3],
  ["398", 3],
  ["528", 3],
  ["608", 3],
  ["764", 3],
  ["100", 2],
  ["818", 2],
  ["348", 2],
  ["368", 2],
  ["380", 2],
  ["752", 2],
  ["004", 1],
  ["040", 1],
  ["170", 1],
  ["196", 1],
  ["203", 1],
  ["208", 1],
  ["724", 1],
  ["246", 1],
  ["376", 1],
  ["388", 1],
  ["400", 1],
  ["438", 1],
  ["504", 1],
  ["458", 1],
  ["512", 1],
  ["586", 1],
  ["642", 1],
  ["688", 1],
  ["682", 1],
  ["158", 1],
  ["862", 1],
  ["710", 1]
] as const satisfies readonly [string, number][];

const WorldTour: FC = () => {
  const d3ContainerRef = useRef<SVGSVGElement | null>(null);

  const parentContainerRef = useRef<HTMLDivElement | null>(null);

  const { containerRef, currentCountry, currentVisitors } = useWorldTour({
    visitorData
  });

  const { height } = useResizeObserver(parentContainerRef);

  return (
    <div
      ref={parentContainerRef}
      className="relative w-full bg-transparent sm:space-y-2">
      <StarFieldBackground height={height} />
      <AnimatePresence mode="popLayout" custom={-1}>
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
                  damping: 75
                }
              }}
              exit={{ opacity: 0, x: -50 }}>
              <div className="absolute inset-x-0 inset-y-0">
                <WorldCountryFlagCounts
                  countryName={currentCountry.countryName}
                  flagUrl={currentCountry.countryFlag}
                  visitors={currentVisitors}
                  flagAspectRatio={currentCountry.flagAspectRatio}
                />
              </div>
            </motion.div>
          </div>
          <BreakoutWrapper>
            <div className="mx-auto max-w-5xl">
              <div className="relative flex h-auto min-w-screen items-center justify-center sm:min-h-[60vh] sm:min-w-full">
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-[10%] left-1/2 h-6 w-[60%] -translate-x-1/2 rounded-full bg-linear-to-bl from-black/10 via-black/25 to-black/30 mix-blend-soft-light blur-sm sm:bottom-[5%]"
                  )}></div>
                <motion.div
                  ref={containerRef}
                  className="relative top-1/2 bottom-1/2 z-10 mx-auto flex aspect-3/4 h-auto w-full items-center justify-center align-middle drop-shadow-sm sm:aspect-square"
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
