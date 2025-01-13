"use client";

import type { Square } from "chess.js";
import type { CSSProperties, FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";

interface ChessboardBotProps {
  onRestart: () => void;
}

const ChessboardBot: FC<ChessboardBotProps> = ({ onRestart }) => {
  const {
    game: _game,
    gameOver,
    gameResult,
    makeStockfishMove,
    isPondering,
    resetGame,
    isPlayerTurn,
    getMoveOptions,
    moves: _moves
  } = useGame();

  const [showGameModal, setShowGameModal] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState<{
    [key: string]:
      | {
          backgroundColor: string;
        }
      | undefined;
  }>({});
  const [optionSquares, setOptionSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  useEffect(() => {
    if (gameOver) {
      setShowGameModal(true);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      setTimeout(makeStockfishMove, 300);
    }
  }, [isPlayerTurn, gameOver, makeStockfishMove]);

  const _handleSquareClick = useCallback(
    (square: Square) => {
      setRightClickedSquares({});
      const options = getMoveOptions(square);
      setOptionSquares(options);
    },
    [getMoveOptions]
  );

  function onSquareRightClick(square: Square) {
    const color = "rgba(255, 0, 0, 0.5)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square]?.backgroundColor === color
          ? undefined
          : { backgroundColor: color }
    });
  }

  return (
    <div className="relative flex gap-8">
      <div>
        {isPondering && (
          <div className="absolute -top-2 right-0 inline-flex items-center justify-center">
            <h3 className="font-sans text-xl font-bold text-gray-900">
              Thinking...
            </h3>
          </div>
        )}
        <Button
          variant="outline"
          size="icon"
          className="absolute -top-12 right-0"
          onClick={onRestart}>
          <RotateCcw className="h-6 w-6 stroke-black" />
        </Button>
        <Chessboard
          onSquareRightClickAction={onSquareRightClick}
          customSquareStyles={
            {
              ...optionSquares,
              ...rightClickedSquares
            } as Record<string, CSSProperties>
          }
        />
      </div>
      <div className="flex-1">
        <MoveHistory />
      </div>
      {showGameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-4">
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              {gameResult}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => {
                  resetGame();
                  setShowGameModal(false);
                }}>
                New Game
              </Button>
              <Button variant="outline" onClick={onRestart}>
                Change Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessboardBot;
