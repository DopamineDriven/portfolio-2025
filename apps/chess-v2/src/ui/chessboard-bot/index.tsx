"use client";

import type { Square } from "chess.js";
import type { CSSProperties, FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import type { CountryCodes } from "@/utils/flags";
import { useGame } from "@/contexts/game-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/atoms/avatar";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";
import { countryCodeToFileName } from "@/utils/flags";

interface ChessboardBotProps {
  onRestart: () => void;
  country: string;
}

const ChessboardBot: FC<ChessboardBotProps> = ({ onRestart, country }) => {
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

  const countryToFile = countryCodeToFileName(country as CountryCodes) || "US";

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
        <div className="relative mb-4 ml-2 flex w-full flex-row items-center justify-between gap-0">
          <div className="my-auto flex flex-row gap-x-2">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-8.png"
                alt="Player"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="relative flex max-w-xs flex-col justify-around text-left">
              <div className="my-auto flex w-full flex-row justify-between gap-x-1">
                <h4 className="text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                  Stockfish
                </h4>
                <Image
                  alt={`/flags/no.svg`}
                  width={30}
                  height={20}
                  src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/no.svg`}
                  className="row-span-1 my-auto aspect-[3/2] h-4 w-6 object-cover"
                />
              </div>
              <span className="-translate-y-1 text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                placeholder
              </span>
            </div>
          </div>
        </div>
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
        <div className="relative ml-2 mt-4 flex w-full flex-row items-center justify-between gap-0">
          <div className="flex flex-row gap-x-2 my-auto">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-4.png"
                alt="Player"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="relative flex max-w-xs flex-col justify-around text-left">
              <div className="my-auto flex w-full flex-row justify-between gap-x-1">
                <h4 className="text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                  {"Username"}
                </h4>
                <Image
                  alt={`/flags/${countryToFile}.svg`}
                  width={30}
                  height={20}
                  src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/${countryToFile}.svg`}
                  className="row-span-1 my-auto aspect-[3/2] h-4 w-6 object-cover"
                />
              </div>
              <span className="-translate-y-1 text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                placeholder
              </span>
            </div>
          </div>
        </div>
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
