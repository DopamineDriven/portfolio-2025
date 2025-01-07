import React from "react";
import type { PieceColor, PieceType } from "@/types/chess";
import {
  BlackBishop,
  BlackKnight,
  BlackQueen,
  BlackRook,
  WhiteBishop,
  WhiteKnight,
  WhiteQueen,
  WhiteRook
} from "@/ui/chess/chess-piece-workup";

interface PawnPromotionModalProps {
  color: PieceColor;
  onSelect: (pieceType: PieceType) => void;
}

const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({
  color,
  onSelect
}) => {
  const pieces = [
    "queen",
    "rook",
    "bishop",
    "knight"
  ] satisfies PieceType[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Promote Pawn</h2>
        <div className="flex space-x-4">
          {pieces.map(piece => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300">
              {color === "white" ? (
                piece === "queen" ? (
                  <WhiteQueen className="h-12 w-12" />
                ) : piece === "rook" ? (
                  <WhiteRook className="h-12 w-12" />
                ) : piece === "bishop" ? (
                  <WhiteBishop className="h-12 w-12" />
                ) : (
                  <WhiteKnight className="h-12 w-12" />
                )
              ) : piece === "queen" ? (
                <BlackQueen className="h-12 w-12" />
              ) : piece === "rook" ? (
                <BlackRook className="h-12 w-12" />
              ) : piece === "bishop" ? (
                <BlackBishop className="h-12 w-12" />
              ) : (
                <BlackKnight className="h-12 w-12" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PawnPromotionModal;
