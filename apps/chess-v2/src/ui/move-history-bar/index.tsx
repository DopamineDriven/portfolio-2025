"use client";

import type { Move } from "chess.js";
import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/atoms/button";

const ITEM_SIZE = 40; // Height of each move item in pixels

interface MoveItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    moveHistory: Move[];
    currentMoveIndex: number;
    goToMove: (index: number) => void;
  };
}

const MoveItem: React.FC<MoveItemProps> = ({ index, style, data }) => {
  const { moveHistory, currentMoveIndex, goToMove } = data;
  const moveIndex = index * 2;
  const whiteMove = moveHistory[moveIndex];
  const blackMove = moveHistory[moveIndex + 1];

  return (
    <div style={style} className="flex items-center space-x-1.5 px-2">
      <span className="text-sm text-gray-400">{index + 1}.</span>
      <button
        className={cn(
          "font-mono text-white",
          moveIndex === currentMoveIndex ? "font-semibold underline" : ""
        )}
        onClick={() => goToMove(moveIndex)}>
        {whiteMove?.san}
      </button>
      {blackMove && (
        <button
          className={cn(
            "font-mono text-white",
            moveIndex + 1 === currentMoveIndex ? "font-semibold underline" : ""
          )}
          onClick={() => goToMove(moveIndex + 1)}>
          {blackMove.san}
        </button>
      )}
    </div>
  );
};

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
  const listRef = useRef<List>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(Math.floor(currentMoveIndex / 2), "smart");
    }
  }, [currentMoveIndex]);

  const itemData = {
    moveHistory,
    currentMoveIndex,
    goToMove
  };

  return (
    <div className="relative flex h-12 w-full items-center overflow-hidden bg-black/90 sm:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={goBackward}
        disabled={!canGoBackward}
        className="h-full px-2 text-white">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="h-full flex-1 overflow-hidden">
        {moveHistory.length === 0 ? (
          <div className="flex h-full items-center px-4">
            <span className="text-sm text-gray-400">No moves yet</span>
          </div>
        ) : (
          <List
            ref={listRef}
            height={48} // Height of the bar
            itemCount={Math.ceil(moveHistory.length / 2)}
            itemSize={ITEM_SIZE}
            width={window.innerWidth - 96} // Subtracting space for buttons
            itemData={itemData}
            layout="horizontal">
            {MoveItem}
          </List>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={goForward}
        disabled={!canGoForward}
        className="h-full px-2 text-white">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
