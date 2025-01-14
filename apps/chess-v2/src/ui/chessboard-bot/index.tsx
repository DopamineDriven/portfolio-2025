"use client";

import type { Square } from "chess.js";
import type { CSSProperties, FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { History, RotateCcw } from "lucide-react";
import type { CountryCodes } from "@/utils/flags";
import { useGame } from "@/contexts/game-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/atoms/avatar";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";
import MoveHistoryBar from "@/ui/move-history-bar";
import { countryCodeToFileName } from "@/utils/flags";
import ChatWidget from "../chat-widget";

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
  const [isReviewMode, setIsReviewMode] = useState(false);
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
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<
    { username: string; content: string }[]
  >([]);

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      setMessages(prevMessages => [
        ...prevMessages,
        { username: "User", content: message }
      ]);
    }
  };
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (gameOver && !isReviewMode) {
      setShowGameModal(true);
    }
  }, [gameOver, isReviewMode]);

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      setTimeout(makeStockfishMove, 300);
    }
  }, [isPlayerTurn, gameOver, makeStockfishMove]);

  const handleReviewMode = () => {
    setIsReviewMode(true);
    setShowGameModal(false);
  };

  const handleNewGame = () => {
    setIsReviewMode(false);
    resetGame();
    setShowGameModal(false);
    onRestart();
  };

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
    <div className="relative flex min-h-screen w-full flex-col items-center py-4">
      <div className="flex w-full flex-col items-center gap-4">
        {isMobile ? (
          <div className="mb-1 w-full sm:hidden">
            <MoveHistoryBar />
          </div>
        ) : (
          <MoveHistory />
        )}
        <div className="flex w-full flex-row items-center justify-between px-4">
          <div className="flex flex-row gap-x-2">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-8.png"
                alt="Player"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="relative flex max-w-xs flex-col justify-around text-left">
              <div className="flex w-full flex-row justify-between gap-x-1">
                <h4 className="text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                  Stockfish
                </h4>
                <Image
                  alt={`/flags/no.svg`}
                  width={30}
                  height={20}
                  src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/no.svg`}
                  className="row-span-1 aspect-[3/2] h-4 w-6 object-cover"
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
            <h3 className="font-sans text-xl font-bold text-gray-100">
              Thinking...
            </h3>
          </div>
        )}
        <Chessboard
          onSquareRightClickAction={onSquareRightClick}
          customSquareStyles={
            {
              ...optionSquares,
              ...rightClickedSquares
            } as Record<string, CSSProperties>
          }
        />
        <div className="flex w-full flex-row items-center justify-between px-4">
          <div className="flex flex-row gap-x-2">
            <Avatar className="h-11 w-11">
              <AvatarImage
                src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-4.png"
                alt="Player"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="relative flex max-w-xs flex-col justify-around text-left">
              <div className="flex w-full flex-row justify-between gap-x-1">
                <h4 className="text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                  {"Username"}
                </h4>
                <Image
                  alt={`/flags/${countryToFile}.svg`}
                  width={30}
                  height={20}
                  src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/${countryToFile}.svg`}
                  className="row-span-1 aspect-[3/2] h-4 w-6 object-cover"
                />
              </div>
              <span className="-translate-y-1 text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                placeholder
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-1.5 right-4 z-50 hidden sm:block">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => {
            resetGame();
            onRestart();
          }}>
          <RotateCcw className="h-6 w-6" />
        </Button>
      </div>
      <ChatWidget messages={messages} onSendMessageAction={handleSendMessage} />
      {showGameModal && (
        <div className="motion-preset-confetti fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 motion-duration-[5000ms]">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {gameResult}
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                onClick={handleNewGame}
                className="w-full text-black">
                New Game
              </Button>
              <Button
                variant="outline"
                onClick={handleReviewMode}
                className="w-full stroke-black text-black">
                <History className="mr-2 h-4 w-4" />
                Review Game
              </Button>
              <Button
                variant="outline"
                onClick={onRestart}
                className="w-full text-black">
                Change Settings
              </Button>
            </div>
          </div>
        </div>
      )}
      {isReviewMode && gameOver && (
        <div className="fixed bottom-4 right-1/2 z-50 rounded-lg bg-white p-4 shadow-lg">
          <Button variant="default" onClick={handleNewGame}>
            Start New Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChessboardBot;
