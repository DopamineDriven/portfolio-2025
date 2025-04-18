"use client";

import { useState } from "react";
import type { ChessColor } from "@/utils/chess-types";
import { toChessGroundColorHelper } from "@/lib/color-helper";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/ui/atoms/tooltip";
import { scoreToPercent } from "@/utils/score-to-percent";

export function EvalBarMobile({
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
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            "mb-1 h-2! w-[min(80dvh,100dvw)]! select-none sm:mb-0 sm:mr-1 sm:h-[min(80dvh,95dvw)]! sm:w-10!",
            !isMobile && chessGroundColor === "black"
              ? "rotate-180"
              : isMobile && chessGroundColor === "white"
                ? "rotate-180"
                : ""
          )}>
          <TooltipContent side={isMobile ? "top" : "bottom"}>
            <p>{`${evalScore}`}</p>
          </TooltipContent>
          <TooltipTrigger
            asChild
            onMouseEnter={() => {
              setOpen(true);
            }}
            onMouseLeave={() => {
              setOpen(false);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            onBlur={() => {
              setOpen(false);
            }}>
            <div
              className={cn(
                "relative h-2 w-full overflow-hidden bg-black sm:h-full sm:w-10"
              )}>
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-2 w-full overflow-hidden bg-white transition-transform duration-500 motion-ease-in-out-quad sm:h-full sm:w-10"
                )}
                style={{
                  transform: isMobile
                    ? `translate3d(${toPercent}%,0,0)`
                    : `translate3d(0,${toPercent}%,0)`
                }}
              />
            </div>
          </TooltipTrigger>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
/**
 *
 *
 *         <div
          className="relative h-auto overflow-hidden cursor-pointer"
          {...(!isMobile
            ? {
                onMouseEnter: () => setIsHovered(true),
                onMouseLeave: () => {
                  setIsHovered(false)
                  setHoveredItem(null)
                },
              }
            : {
                onClick: () => setIsMenuOpen(!isMenuOpen),
              })}
        >
             <motion.div
                initial={{ y: 0 }}
                animate={{ y: 0 }}
                exit={{ y: -40 }}
                enter={{y: 0}}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="flex w-full justify-between">
              <span className="text-[#f5f5f5]">Menu</span>
              <span>Menu</span>
              <Link href="/" className="text-[#f5f5f5]">
                AR
              </Link>
            </motion.div>
 */
