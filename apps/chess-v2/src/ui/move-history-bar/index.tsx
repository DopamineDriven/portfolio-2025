"use client";

import type { Move } from "chess.js";
import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/atoms/button";

export default function MoveHistoryBar() {
  const {
    moveHistory,
    currentMoveIndex,
    goToMove,
    canGoForward,
    canGoBackward,
    goForward,
    goBackward
  } = useGame();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true
  });

  const scrollToIndex = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(Math.floor(index / 2));
      }
    },
    [emblaApi]
  );

  // Scroll to current move when it changes
  useEffect(() => {
    if (currentMoveIndex >= 0) {
      scrollToIndex(currentMoveIndex);
    }
  }, [currentMoveIndex, scrollToIndex]);

  const moves = moveHistory?.reduce(
    (acc, move, index) => {
      if (index % 2 === 0) {
        acc.push({ whiteMove: move, blackMove: moveHistory[index + 1] });
      }
      return acc;
    },
    [] as { whiteMove: Move; blackMove?: Move }[]
  );

  const MoveItem = ({
    index,
    whiteMove,
    blackMove
  }: {
    index: number;
    whiteMove: Move;
    blackMove?: Move;
  }) => {
    const moveIndex = index * 2;

    return (
      <div className="embla__slide flex h-full min-w-[100px] flex-[0_0_auto] items-center justify-center px-3">
        <div className="mr-0.5 text-xs text-gray-400">{index + 1}.</div>
        <div className="flex items-center gap-0.5">
          <button
            className={cn(
              "font-mono text-sm text-white",
              moveIndex === currentMoveIndex ? "font-semibold underline" : ""
            )}
            onClick={() => goToMove(moveIndex)}>
            {whiteMove.san}
          </button>
          {blackMove && (
            <button
              className={cn(
                "font-mono text-sm text-white",
                moveIndex + 1 === currentMoveIndex
                  ? "font-semibold underline"
                  : ""
              )}
              onClick={() => goToMove(moveIndex + 1)}>
              {blackMove.san}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex h-12 w-full items-center overflow-hidden bg-black/90 sm:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={goBackward}
        disabled={!canGoBackward}
        className="absolute left-0 z-10 h-full px-2 text-white">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="mx-10 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {moves.map((move, index) => (
            <MoveItem
              key={index}
              index={index}
              whiteMove={move.whiteMove}
              blackMove={move.blackMove}
            />
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={goForward}
        disabled={!canGoForward}
        className="absolute right-0 z-10 h-full px-2 text-white">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
