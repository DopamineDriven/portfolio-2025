"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Board } from "@/types/chess";
import ChessPiece from "./chess-piece";

interface ChessboardProps {
  board: Board;
  selectedSquare: [number, number] | null;
  possibleMoves: [number, number][];
  onSquareClick?: (row: number, col: number) => void;
  className?: string;
}

const Chessboard: React.FC<ChessboardProps> = ({
  board,
  selectedSquare,
  possibleMoves,
  onSquareClick,
  className
}) => {
  return (
    <div
      className={cn(
        `relative grid h-96 w-96 grid-cols-8 gap-0 border-4 border-gray-800`,
        className
      )}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isSelected =
            selectedSquare?.[0] === rowIndex && selectedSquare[1] === colIndex;
          const isPossibleMove = possibleMoves.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          const isLight = (rowIndex + colIndex) % 2 === 0;

          return (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                isLight ? "bg-amber-200" : "bg-amber-800",
                isSelected ? "bg-[hsl(60,100%,50%)]/90" : "",
                isPossibleMove
                  ? "relative before:absolute before:top-1/2 before:left-1/2 before:h-4 before:w-4 before:-translate-x-1/2 before:-translate-y-1.5 before:rounded-full before:bg-black/15"
                  : "",
                `flex h-12 w-12 cursor-pointer items-center justify-center`
              )}
              onClick={() => onSquareClick?.(rowIndex, colIndex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {piece && <ChessPiece piece={piece} />}
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default Chessboard;
