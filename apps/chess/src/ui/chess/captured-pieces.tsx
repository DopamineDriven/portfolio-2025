import React from "react";
import { PIECE_VALUES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Piece, PieceColor } from "@/types/chess";
import { getCapturedPieceJsxElement } from "./piece-helper";

export interface CapturedPiecesProps {
  pieces: Piece[];
  color: PieceColor;
  score: number;
  opponentScore: number;
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  pieces,
  color,
  score,
  opponentScore
}) => {
  // Sort pieces by value (highest to lowest)
  const sortedPieces = [...pieces].sort(
    (a, b) => PIECE_VALUES[b.type] - PIECE_VALUES[a.type]
  );

  // Calculate relative score
  const relativeScore = score - opponentScore;
  const showScore = relativeScore > 0;

  return (
    <div
      className={cn(
        `flex h-12 select-none items-center gap-1 p-2`,
        color === "black" ? "flex-row" : "flex-row-reverse"
      )}>
      <div className="flex gap-1">
        {sortedPieces.map((piece, index) => (
          <div
            key={`${piece.color}-${piece.type}-${index}`}
            className={cn(`h-6 w-6`)}>
            {getCapturedPieceJsxElement(piece.type, piece.color)}
          </div>
        ))}
      </div>
      {showScore && (
        <div className="ml-2 w-12 text-sm font-semibold tabular-nums">
          +{relativeScore}
        </div>
      )}
    </div>
  );
};
