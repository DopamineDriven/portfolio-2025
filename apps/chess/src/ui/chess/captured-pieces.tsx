import React from "react";
import { PIECE_VALUES } from "@/lib/constants";
import { Piece, PieceColor } from "@/types/chess";

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
      className={`select-none flex h-12 items-center gap-1 p-2 ${color === "black" ? "flex-row" : "flex-row-reverse"}`}>
      <div className="flex gap-1">
        {sortedPieces.map((piece, index) => (
          <div
            key={index}
            className={`text-2xl ${piece.color === "white" ? "text-white" : "text-black"}`}>
            {getPieceSymbol(piece.type, piece.color)}
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

function getPieceSymbol(type: string, color: string) {
  const symbols: { [key: string]: string } = {
    "white-king": "♔",
    "white-queen": "♕",
    "white-rook": "♖",
    "white-bishop": "♗",
    "white-knight": "♘",
    "white-pawn": "♙",
    "black-king": "♚",
    "black-queen": "♛",
    "black-rook": "♜",
    "black-bishop": "♝",
    "black-knight": "♞",
    "black-pawn": "♟"
  };
  return symbols[`${color}-${type}`] ?? "";
}
