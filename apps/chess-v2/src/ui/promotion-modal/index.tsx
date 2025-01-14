"use client";

import React from "react";
import * as ChessIcons from "@d0paminedriven/chess-icons";
import type { ChessColor } from "@/utils/chess-types";
import { Button } from "@/ui/atoms/button";
import { Dialog, DialogContent } from "@/ui/atoms/dialog";

interface PromotionPieceProps {
  color: ChessColor;
  piece: "queen" | "rook" | "bishop" | "knight";
  onClick: () => void;
}

const PromotionPiece: React.FC<PromotionPieceProps> = ({
  color,
  piece,
  onClick
}) => {
  const IconComponent =
    color === "white"
      ? ChessIcons[
          `White${piece.charAt(0).toUpperCase() + piece.slice(1)}` as `White${Capitalize<typeof piece>}`
        ]
      : ChessIcons[
          `Black${piece.charAt(0).toUpperCase() + piece.slice(1)}` as `Black${Capitalize<typeof piece>}`
        ];

  return (
    <Button onClick={onClick} variant="outline" className="h-20 w-20 p-2">
      <IconComponent current={null} className="h-full w-full" />
    </Button>
  );
};

interface PromotionModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onPromotionAction: (piece: "q" | "r" | "b" | "n") => void;
  color: ChessColor;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onCloseAction,
  onPromotionAction,
  color
}) => {
  const handlePromotion = (piece: "q" | "r" | "b" | "n") => {
    onPromotionAction(piece);
    onCloseAction();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction} >
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-center space-x-4">
          <PromotionPiece
            color={color}
            piece="queen"
            onClick={() => handlePromotion("q")}
          />
          <PromotionPiece
            color={color}
            piece="rook"
            onClick={() => handlePromotion("r")}
          />
          <PromotionPiece
            color={color}
            piece="bishop"
            onClick={() => handlePromotion("b")}
          />
          <PromotionPiece
            color={color}
            piece="knight"
            onClick={() => handlePromotion("n")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionModal;
