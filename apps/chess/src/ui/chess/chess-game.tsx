"use client";

import React from "react";
import { motion } from "motion/react";
import type { PieceType } from "@/types/chess";
import { useChessGame } from "@/hooks/use-chess-game";
import { CapturedPieces } from "./captured-pieces";
import Chessboard from "./chessboard";
import PawnPromotionModal from "./pawn-promotion";

const ChessGame: React.FC = () => {
  const {
    board,
    currentPlayer,
    selectedSquare,
    possibleMoves,
    isCheck,
    isCheckmate,
    capturedPieces,
    score,
    selectSquare,
    resetGame,
    promotionSquare,
    promotePawn
  } = useChessGame();

  const handleSquareClick = (row: number, col: number) => {
    selectSquare(row, col);
  };

  const handlePromotion = (pieceType: PieceType) => {
    if (promotionSquare) {
      promotePawn(promotionSquare, pieceType);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-600 py-8 text-gray-300">
      {/* Fixed height container for black's captured pieces */}
      <div className="h-12 w-full max-w-md">
        <CapturedPieces
          pieces={capturedPieces.black}
          color="black"
          score={score.black}
          opponentScore={score.white}
        />
      </div>
      <div className="mb-4 flex h-20 flex-col items-center justify-center">
        <p className="text-xl">{currentPlayer + " to move"}</p>
        {isCheck && !isCheckmate && (
          <p className="text-xl font-bold text-red-600">
            {currentPlayer} is in check!
          </p>
        )}
        {isCheckmate && (
          <div className="motion-preset-confetti motion-duration-[5000ms]">
            <p className="mb-2 text-2xl font-bold text-red-600">Checkmate!</p>
            <p className="text-xl font-semibold">
              {currentPlayer === "white" ? "Black" : "White"} wins!
            </p>
          </div>
        )}
      </div>
      <Chessboard
        board={board}
        selectedSquare={selectedSquare}
        possibleMoves={possibleMoves}
        onSquareClick={isCheckmate ? undefined : handleSquareClick}
        className={isCheckmate ? "pointer-events-none opacity-80" : ""}
      />
      {/* Fixed height container for white's captured pieces */}
      <div className="h-12 w-full max-w-md">
        <CapturedPieces
          pieces={capturedPieces.white}
          color="white"
          score={score.white}
          opponentScore={score.black}
        />
      </div>
      <motion.button
        className="mt-8 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        onClick={resetGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        Reset Game
      </motion.button>
      {promotionSquare && (
        <PawnPromotionModal color={currentPlayer} onSelect={handlePromotion} />
      )}
    </div>
  );
};

export default ChessGame;
