"use client";

import * as ChessIcons from "@d0paminedriven/chess-icons";
import type { MaterialCount } from "@/types/values";
import { cn } from "@/lib/utils";
import { PIECE_VALUES } from "@/types/values";
import type { ChessColor } from "@/utils/chess-types";
import { toChessGroundColorHelper } from "@/lib/color-helper";

interface CapturedPiecesProps {
  capturedPieces: MaterialCount;
  score: number;
  showScore?: boolean;
  className?: string;
  color: ChessColor;
}

export default function CapturedPieces({
  capturedPieces,
  score,
  showScore = false,
  className = "",
  color
}: CapturedPiecesProps) {
  // Convert the captured pieces object into an array of pieces to display
  const piecesToShow = Object.entries(capturedPieces).flatMap(
    ([piece, count]: [string, number]) => {
      return Array.from({ length: count }, () => piece);
    }
  );
  console.log("[CapturedPieces] piecesToShow:", piecesToShow);

  const handlePieceIcons = (target: keyof typeof PIECE_VALUES) => {
    switch (target) {
      case "b": {
        return "Bishop";
      }
      case "k": {
        return "King";
      }
      case "n": {
        return "Knight";
      }
      case "p": {
        return "Pawn";
      }
      case "q": {
        return "Queen";
      }
      default: {
        return "Rook";
      }
    }
  };

  // Get the appropriate icon component for each piece
  const getPieceIcon = (piece: keyof typeof PIECE_VALUES) => {
    const colorToShow = toChessGroundColorHelper(color) === "white" ? "Black" : "White";
    const pieceType = piece;
    const iconName =
      `${colorToShow}${handlePieceIcons(pieceType as keyof typeof PIECE_VALUES)}` as const as keyof typeof ChessIcons;
    const IconComponent = ChessIcons[iconName];
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className={cn(className, `flex items-center gap-0.5`)}>
      <div className="flex items-center gap-0.5">
        {piecesToShow.map((piece, index) => {
          const pieceValue = piece as keyof typeof PIECE_VALUES;
          const Icon = getPieceIcon(pieceValue);
          return (
            <div key={`${pieceValue}-${index}`} className="h-5 w-5">
              {Icon}
            </div>
          );
        })}
      </div>
      {showScore && score > 0 && (
        <span className="text-sm font-medium text-white">&nbsp;+{score}</span>
      )}
    </div>
  );
}
