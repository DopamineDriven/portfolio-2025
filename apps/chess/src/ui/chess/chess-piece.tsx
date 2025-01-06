import React from "react";
import type { Piece } from "@/types/chess";
import { cn } from "@/lib/utils";
import { getPieceComponent } from "./piece-helper";

interface ChessPieceProps {
  piece: Piece;
  className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, className }) => {
  const PieceComponent = getPieceComponent(piece.type, piece.color);
  return (
    <div
      className={cn(
        `flex h-full w-full items-center justify-center`,
        className
      )}>
      <PieceComponent className="h-3/4 w-3/4" />
    </div>
  );
};

export default ChessPiece;
