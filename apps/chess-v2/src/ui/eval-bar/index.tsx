"use client";

import { toChessGroundColorHelper } from "@/lib/color-helper";
import { cn } from "@/lib/utils";
import { ChessColor } from "@/utils/chess-types";
import { scoreToPercent } from "@/utils/score-to-percent";

export function EvalBar({
  playerColor,
  evalScore,
  isMobile
}: {
  playerColor: ChessColor;
  evalScore: number;
  isMobile: boolean;
}) {
  const chessGroundColor = toChessGroundColorHelper(playerColor);
  const toPercent = scoreToPercent(evalScore);
  return (
    <div
      className={cn(
        "!h-4 !w-[min(80dvh,100dvw)] sm:!h-[min(80dvh,95dvw)] sm:!w-10 mb-1 sm:mb-0 sm:mr-1",
        !isMobile && chessGroundColor === "black"
          ? "rotate-180"
          : isMobile && chessGroundColor === "white"
            ? "rotate-180"
            : ""
      )}>
      <div
        className={cn(
          "relative h-4 w-full overflow-hidden bg-black sm:h-full sm:w-10"
        )}>
        <div
          className={cn(
            "absolute bottom-0 overflow-hidden left-0 h-4 w-full sm:h-full sm:w-10 bg-white transition-transform duration-500 ease-in"
          )}
          style={{
            transform: isMobile
              ? `translate3d(${toPercent}%,0,0)`
              : `translate3d(0,${toPercent}%,0)`
          }}
        />
      </div>
    </div>
  );
}
