"use client";

import type { Move } from "chess.js";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/atoms/button";

const ITEM_SIZE = 30; // Height of each move item in pixels
const MOVE_HISTORY_WIDTH = 256; // Width of the move history panel in pixels

interface MoveItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    moveHistory: Move[];
    currentMoveIndex: number;
    goToMove: (index: number) => void;
  };
}

// Move Virtualization for performance optimization
const MoveItem: React.FC<MoveItemProps> = ({ index, style, data }) => {
  const { moveHistory, currentMoveIndex, goToMove } = data;
  const moveIndex = index * 2;
  const whiteMove = moveHistory[moveIndex];
  const blackMove = moveHistory[moveIndex + 1];

  return (
    <div style={style} className="flex items-center hover:bg-gray-600">
      <div className="w-10 px-2 py-1 text-gray-400">{index + 1}.</div>
      <div
        className={cn(
          moveIndex === currentMoveIndex ? "font-semibold underline" : "",
          "w-1/2 cursor-pointer px-2 py-1 font-mono hover:underline"
        )}
        onClick={() => goToMove(moveIndex)}>
        {whiteMove?.san ?? ""}
      </div>
      <div
        className={cn(
          moveIndex + 1 === currentMoveIndex ? "font-semibold underline" : "",
          "w-1/2 cursor-pointer px-2 py-1 font-mono hover:underline"
        )}
        onClick={() => goToMove(moveIndex + 1)}>
        {blackMove?.san ?? ""}
      </div>
    </div>
  );
};

export default function MoveHistory() {
  const {
    moveHistory,
    currentMoveIndex,
    goToMove,
    canGoForward,
    canGoBackward,
    goForward,
    goBackward
  } = useGame();
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div
      className={cn(
        isExpanded ? "w-64" : "w-12",
        `fixed right-0 top-0 z-40 h-full bg-gray-700 transition-all duration-300 ease-in-out`
      )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-4 top-1/2 -translate-y-1/2 transform rounded-l-md bg-gray-700 text-white"
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      {isExpanded && (
        <div className="h-full p-4">
          <h2 className="mb-2 text-xl font-bold text-white">Move History</h2>
          <div className="mb-2 flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBackward}
              disabled={!canGoBackward}
              className="text-white">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goForward}
              disabled={!canGoForward}
              className="text-white">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-3rem)]">
            <List
              ref={listRef}
              height={window.innerHeight - 200} // Adjust based on layout
              itemCount={Math.ceil(moveHistory.length / 2)}
              itemSize={ITEM_SIZE}
              width={MOVE_HISTORY_WIDTH - 32} // Subtract padding
              itemData={itemData}>
              {MoveItem}
            </List>
          </div>
        </div>
      )}
    </div>
  );
}
