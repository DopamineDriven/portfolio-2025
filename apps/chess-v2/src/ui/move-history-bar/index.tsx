"use client";

import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useGame } from "@/contexts/game-context";

export default function MoveHistoryBar() {
  const { moves } = useGame();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "end"
  });

  const scrollToEnd = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollTo(emblaApi.scrollSnapList().length - 1);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (moves.length > 0) {
      scrollToEnd();
    }
  }, [moves, scrollToEnd]);

  return (
    <div className="relative h-12 w-full overflow-hidden bg-black/90 sm:hidden">
      <div className="embla flex h-full items-center" ref={emblaRef}>
        <div className="embla__container flex h-full items-center gap-1.5 px-1">
          {moves.length === 0 ? (
            <div className="embla__slide flex h-full shrink-0 items-center">
              <span className="text-sm text-gray-400">No moves yet</span>
            </div>
          ) : (
            moves.filter((t) => t!=null).reduce((rows: React.ReactNode[], move, index) => {
              const toLog = JSON.stringify({
                index: index,
                move: move,
                moves: moves
              }, null, 2)
              console.log(toLog)
              if (index % 2 === 0) {
                rows.push(
                  <div
                    key={Math.floor(index / 2)}
                    className="embla__slide ml-0.5 flex h-full shrink-0 items-center space-x-1.5 first:ml-0">
                    <span className="text-sm text-gray-400">
                      {Math.floor(index / 2) + 1}.
                    </span>
                    <span className="font-mono text-white">{move}</span>
                    {moves[index + 1] && (
                      <span className="font-mono text-white">
                        {moves[index + 1]}
                      </span>
                    )}
                  </div>
                );
              }
              return rows;
            }, [])
          )}
        </div>
      </div>
    </div>
  );
}
