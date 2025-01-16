"use client";

import type { Square } from "chess.js";
import type { CSSProperties, FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronDown as _ChevronDown,
  ChevronUp as _ChevronUp,
  Lightbulb as _Lightbulb,
  ChevronLeft,
  ChevronRight,
  History,
  Redo,
  RotateCcw,
  Undo
} from "lucide-react";
import type { CountryCodes } from "@/utils/flags";
import { useGame } from "@/contexts/game-context";
import { toChessGroundColorHelper } from "@/lib/color-helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/atoms/avatar";
import { Button } from "@/ui/atoms/button";
import CapturedPieces from "@/ui/captured-pieces";
import ChatWidget from "@/ui/chat-widget";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";
import MoveHistoryBar from "@/ui/move-history-bar";
import { countryCodeToFileName } from "@/utils/flags";

interface ChessboardBotProps {
  onRestart: () => void;
  country: string;
}

const ChessboardBot: FC<ChessboardBotProps> = ({ onRestart, country }) => {
  const {
    gameOver,
    gameResult,
    makeStockfishMove,
    isPondering,
    resetGame,
    isPlayerTurn,
    getMoveOptions,
    capturedPieces,
    materialScore,
    mode,
    playerColor,
    moveHistory,
    currentMoveIndex,
    goToMove,
    canGoForward,
    canGoBackward,
    goForward,
    game,
    goBackward,
    undo,
    redo,
    canUndo,
    canRedo,
    getComment,
    chessApiEvaluation,
    requestChessApiEvaluation
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
  const [_currentComment, setCurrentComment] = useState<string | undefined>(
    undefined
  );
  const [_showHint, setShowHint] = useState(false);
  const [_showEvaluation, _setShowEvaluation] = useState(false);
  const [hintSquares, setHintSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

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

  useEffect(() => {
    if (isReviewMode) {
      setCurrentComment(getComment());
    }
  }, [isReviewMode, currentMoveIndex, getComment]);

  const handleMoveNavigation = (index: number) => {
    goToMove(index);
    setOptionSquares({});
    setRightClickedSquares({});
    if (isReviewMode) {
      setCurrentComment(getComment());
    }
  };
  useEffect(() => {
    if (!gameOver) {
      requestChessApiEvaluation();
    }
  }, [game, gameOver, requestChessApiEvaluation]);

  const _handleShowHint = useCallback(() => {
    if (chessApiEvaluation?.from && chessApiEvaluation?.to) {
      setHintSquares({
        [chessApiEvaluation.from]: {
          background: "rgba(130, 77, 255, 0.4)",
          borderRadius: "50%"
        },
        [chessApiEvaluation.to]: {
          background: "rgba(130, 77, 255, 0.4)",
          borderRadius: "50%"
        }
      });
      setShowHint(true);
    }
  }, [chessApiEvaluation]);

  const _handleHideHint = useCallback(() => {
    setHintSquares({});
    setShowHint(false);
  }, []);
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
        <div className="relative flex w-full flex-row justify-between px-4">
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
              <span className="text-pretty pt-1 font-sans text-[1rem] leading-normal tracking-tight">
                <CapturedPieces
                  color={
                    toChessGroundColorHelper(playerColor) === "black"
                      ? "white"
                      : "black"
                  }
                  capturedPieces={
                    capturedPieces[
                      toChessGroundColorHelper(playerColor) === "white"
                        ? "white"
                        : "black"
                    ]
                  }
                  score={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.black - materialScore.white
                      : materialScore.white - materialScore.black
                  }
                  showScore={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.black > materialScore.white
                      : materialScore.white > materialScore.black
                  }
                />
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
        {/* <div className="relative w-full">
          <Chessboard
            onSquareRightClickAction={onSquareRightClick}
            customSquareStyles={
              {
                ...optionSquares,
                ...rightClickedSquares,
                ...hintSquares
              } as Record<string, CSSProperties>
            }
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            {mode !== "challenge" && (
              <Button
                variant="secondary"
                size="icon"
                className="bg-gray-800 text-white hover:bg-gray-700"
                onClick={showHint ? handleHideHint : handleShowHint}
                aria-label={
                  showHint ? "Hide move suggestion" : "Show move suggestion"
                }>
                <Lightbulb
                  className={`h-5 w-5 ${showHint ? "text-yellow-400" : "text-gray-400"}`}
                />
              </Button>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => setShowEvaluation(!showEvaluation)}
              aria-label={
                showEvaluation ? "Hide evaluation" : "Show evaluation"
              }>
              {showEvaluation ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showEvaluation ? "h-32" : "h-0"
          }`}>
          <div className="rounded-lg bg-gray-800 p-4 text-white">
            <h3 className="mb-2 text-lg font-semibold">Position Evaluation:</h3>
            {chessApiEvaluation ? (
              <>
                <p>{chessApiEvaluation.text}</p>
                {chessApiEvaluation.continuationArr && (
                  <div className="mt-2">
                    <h4 className="font-semibold">Suggested continuation:</h4>
                    <p>{chessApiEvaluation.continuationArr.join(", ")}</p>
                  </div>
                )}
              </>
            ) : (
              <p>Waiting for evaluation...</p>
            )}
          </div>
        </div> */}
        <Chessboard
          onSquareRightClickAction={onSquareRightClick}
          customSquareStyles={
            {
              ...optionSquares,
              ...rightClickedSquares,
              ...hintSquares
            } as Record<string, CSSProperties>
          }
        />
        <div className="relative flex w-full flex-row justify-between px-4">
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
              <span className="text-pretty pt-1 font-sans text-[1rem] leading-normal tracking-tight">
                <CapturedPieces
                  color={
                    toChessGroundColorHelper(playerColor) === "black"
                      ? "black"
                      : "white"
                  }
                  capturedPieces={
                    capturedPieces[
                      toChessGroundColorHelper(playerColor) === "white"
                        ? "black"
                        : "white"
                    ]
                  }
                  score={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.white - materialScore.black
                      : materialScore.black - materialScore.white
                  }
                  showScore={
                    toChessGroundColorHelper(playerColor) === "white"
                      ? materialScore.white > materialScore.black
                      : materialScore.black > materialScore.white
                  }
                />
              </span>
            </div>
          </div>
          <div className="flex w-full flex-row justify-end space-x-2 text-right">
            {mode === "challenge" ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goBackward}
                  disabled={!canGoBackward}>
                  <ChevronLeft className="h-6 w-6 stroke-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className=""
                  onClick={goForward}
                  disabled={!canGoForward}>
                  <ChevronRight className="h-6 w-6 stroke-primary" />
                </Button>
                <Button
                  className="hidden sm:block"
                  disabled={
                    gameOver && currentMoveIndex === moveHistory.length - 1
                  }
                  variant="default"
                  onClick={() => handleMoveNavigation(moveHistory.length - 1)}>
                  Current Position
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo || gameOver}
                  aria-label="Undo move">
                  <Undo className="h-6 w-6 stroke-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goBackward}
                  disabled={!canGoBackward}>
                  <ChevronLeft className="h-6 w-6 stroke-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className=""
                  onClick={goForward}
                  disabled={!canGoForward}>
                  <ChevronRight className="h-6 w-6 stroke-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo || gameOver}
                  aria-label="Redo move">
                  <Redo className="h-6 w-6 stroke-primary" />
                </Button>
                <Button
                  className="hidden sm:block"
                  disabled={
                    gameOver && currentMoveIndex === moveHistory.length - 1
                  }
                  variant="default"
                  onClick={() => handleMoveNavigation(moveHistory.length - 1)}>
                  Current Position
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 h-32 overflow-y-auto rounded-lg bg-gray-800 p-4 text-white">
        <h3 className="mb-2 text-lg font-semibold">Position Evaluation:</h3>
        {chessApiEvaluation ? (
          <>
            <p>{chessApiEvaluation.text}</p>
            {chessApiEvaluation.continuationArr && (
              <div className="mt-2">
                <h4 className="font-semibold">Suggested continuation:</h4>
                <p>{chessApiEvaluation.continuationArr.join(", ")}</p>
              </div>
            )}
          </>
        ) : (
          <p>Waiting for evaluation...</p>
        )}
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
          <RotateCcw className="h-6 w-6 stroke-primary" />
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
