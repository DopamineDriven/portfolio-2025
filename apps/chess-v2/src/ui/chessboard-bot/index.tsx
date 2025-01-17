"use client";

import type { Square } from "chess.js";
import type { Key } from "chessground/types";
import type { CSSProperties, FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  History,
  Info,
  Lightbulb,
  RotateCcw,
  Brain
} from "lucide-react";
import type { CountryCodes } from "@/utils/flags";
import { useGame } from "@/contexts/game-context";
import { toChessGroundColorHelper } from "@/lib/color-helper";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/atoms/avatar";
import { Button } from "@/ui/atoms/button";
import CapturedPieces from "@/ui/captured-pieces";
import ChatWidget from "@/ui/chat-widget";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";
import MoveHistoryBar from "@/ui/move-history-bar";
import { countryCodeToFileName } from "@/utils/flags";
import PositionAnalysis from "../position-analysis";

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
    playerColor,
    moveHistory,
    currentMoveIndex,
    goToMove,
    canGoForward,
    isConnected,
    canGoBackward,
    goForward,
    game,
    goBackward,
    getComment,
    chessApiEvaluation,
    requestChessApiEvaluation,
    setIsNavigatingHistoryExplicitly
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

  const [currentComment, setCurrentComment] = useState<string | undefined>(
    undefined
  );

  const [showHint, setShowHint] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true); // Update: showAnalysis is true by default

  // const [autoSuggest, setAutoSuggest] = useState(false);

  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const [hintSquares, setHintSquares] = useState<Map<Key, string>>(
    new Map<Key, string>()
  );

  const clearHighlights = useCallback(() => {
    setHintSquares(new Map<Key, string>());
    setShowHint(false);
  }, []);

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
      setTimeout(() => {
        makeStockfishMove();
        clearHighlights();
      }, 300);
    }
  }, [isPlayerTurn, gameOver, makeStockfishMove, clearHighlights]);

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
      const comment = getComment();
      setCurrentComment(comment);
    }
  }, [isReviewMode, currentMoveIndex, getComment]);

  const handleMoveNavigation = (index: number) => {
    goToMove(index);
    setOptionSquares({});
    setRightClickedSquares({});
    clearHighlights();
    if (isReviewMode) {
      setCurrentComment(getComment());
    }

    requestChessApiEvaluation();
    setIsNavigatingHistoryExplicitly(index !== moveHistory.length - 1);
  };

  useEffect(() => {
    if (!gameOver) {
      requestChessApiEvaluation();
    }
  }, [game, gameOver, requestChessApiEvaluation]);

  const handleShowHint = useCallback(() => {
    if (chessApiEvaluation?.from && chessApiEvaluation?.to) {
      const newHintSquares = new Map<Key, string>();
      newHintSquares.set(chessApiEvaluation.from as Key, "hint-from");
      newHintSquares.set(chessApiEvaluation.to as Key, "hint-to");
      setHintSquares(newHintSquares);
      setShowHint(true);
    }
  }, [chessApiEvaluation]);

  useEffect(() => {
    if (chessApiEvaluation) {
      setIsAnalysisLoading(false);
    }
  }, [chessApiEvaluation]);

  const handleHideHint = useCallback(() => {
    setHintSquares(new Map<Key, string>());
    setShowHint(false);
  }, []);

  const handleReturnToStart = () => {
    handleMoveNavigation(-1);
    setIsNavigatingHistoryExplicitly(true);
  };

  const handleReturnToCurrent = () => {
    handleMoveNavigation(moveHistory.length - 1);
    setIsNavigatingHistoryExplicitly(false);
  };

  const handleGoForward = () => {
    goForward();
    setIsNavigatingHistoryExplicitly(
      currentMoveIndex + 1 !== moveHistory.length - 1
    );
  };

  const handleGoBackward = () => {
    goBackward();
    setIsNavigatingHistoryExplicitly(true);
  };

  return (
    <div className="max-w-10xl mx-auto w-full sm:px-2 lg:px-4">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="mx-auto w-full">
          {isMobile ? (
            <div className="w-full sm:hidden">
              <MoveHistoryBar />
            </div>
          ) : (
            <MoveHistory />
          )}
          <div className="my-2 flex w-full flex-row items-center justify-between px-2 sm:my-4">
            <div className="flex flex-row gap-x-2">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-8.png"
                  alt="Player"
                />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="relative flex max-w-xs flex-col justify-around text-left lg:max-w-md">
                <div className="flex w-full flex-row justify-between gap-x-1">
                  <h4 className="my-0 text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                    Stockfish ({playerColor === "white" ? "Black" : "White"})
                  </h4>
                  <Image
                    alt={`/flags/no`}
                    width={30}
                    height={20}
                    src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/no.svg`}
                    className="row-span-1 my-0 aspect-[3/2] h-4 w-6 object-cover"
                  />
                </div>
                <span className="text-pretty font-sans text-[1rem] leading-normal tracking-tight">
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
          {!isMobile && isPondering && (
            <div className="absolute left-12 top-4 inline-flex items-center justify-center ">
              <h3 className="font-sans text-xl font-bold text-gray-100">
                <Brain className="stroke-gray-100 motion-preset-spin motion-loop-infinite" />
              </h3>
            </div>
          )}
          <div className="relative w-full">
            <Chessboard
              onSquareRightClickAction={onSquareRightClick}
              customSquareStyles={
                {
                  ...optionSquares,
                  ...rightClickedSquares
                } as Record<string, CSSProperties>
              }
              customHighlights={showHint ? hintSquares : new Map()}
              clearHighlightsAction={clearHighlights}
            />
            <div className="absolute -bottom-[6.5rem] right-14 flex flex-row gap-2 sm:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={showHint ? handleHideHint : handleShowHint}
                aria-label={
                  showHint ? "Hide move suggestion" : "Show move suggestion"
                }>
                <Lightbulb
                  className={cn(
                    showHint ? "stroke-purple-700" : "stroke-primary",
                    `h-6 w-6`
                  )}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAnalysis(!showAnalysis)}
                aria-label={
                  showAnalysis
                    ? "Hide position analysis"
                    : "Show position analysis"
                }>
                <Info
                  className={cn(
                    showAnalysis ? "stroke-purple-700" : "stroke-primary",
                    `h-6 w-6`
                  )}
                />
              </Button>
            </div>
          </div>

          <div className="mt-2 flex w-full flex-row items-center justify-between px-2 sm:mt-4">
            <div className="flex flex-row gap-x-2">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/chess-default-4.png"
                  alt="Player"
                />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="relative flex max-w-xs flex-col justify-around text-left">
                <div className="flex w-full flex-row justify-between gap-x-1">
                  <h4 className="my-0 text-pretty font-sans text-[1rem] leading-normal tracking-tight">
                    Username
                  </h4>
                  <Image
                    alt={`/flags/${countryToFile}`}
                    width={30}
                    height={20}
                    src={`https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/flags/${countryToFile}.svg`}
                    className="row-span-1 my-0 aspect-[3/2] h-4 w-6 object-cover"
                  />
                </div>
                <span className="text-pretty font-sans text-[1rem] leading-normal tracking-tight">
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
              <Button
                size="icon"
                disabled={!canGoBackward}
                variant="outline"
                onClick={handleReturnToStart}>
                <ChevronsLeft className="h-6 w-6 stroke-primary" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleGoBackward}
                disabled={!canGoBackward}>
                <ChevronLeft className="h-6 w-6 stroke-primary" />
              </Button>
              {!isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={showHint ? handleHideHint : handleShowHint}
                  aria-label={
                    showHint ? "Hide move suggestion" : "Show move suggestion"
                  }>
                  <Lightbulb
                    className={cn(
                      showHint ? "stroke-purple-700" : "stroke-primary",
                      `h-6 w-6`
                    )}
                  />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className=""
                onClick={handleGoForward}
                disabled={!canGoForward}>
                <ChevronRight className="h-6 w-6 stroke-primary" />
              </Button>
              <Button
                size="icon"
                disabled={currentMoveIndex === moveHistory.length - 1}
                variant="outline"
                onClick={handleReturnToCurrent}>
                <ChevronsRight className="h-6 w-6 stroke-primary" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-20 right-6 z-50 hidden sm:block">
        <ChatWidget
          messages={messages}
          onSendMessageAction={handleSendMessage}
        />
      </div>
      <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
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
                className="w-full">
                New Game
              </Button>
              <Button
                variant="outline"
                onClick={handleReviewMode}
                className="w-full">
                <History className="mr-2 h-4 w-4 text-primary" />
                Review Game
              </Button>
              <Button
                variant="outline"
                onClick={onRestart}
                className="w-full text-primary">
                Change Settings
              </Button>
            </div>
          </div>
        </div>
      )}
      {isReviewMode && gameOver && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-white p-4 shadow-lg">
          <Button variant="default" onClick={handleNewGame}>
            Start New Game
          </Button>
        </div>
      )}
      {isReviewMode && (
        <div className="mt-4 rounded-lg bg-gray-800 p-4 text-white">
          <h3 className="mb-2 text-lg font-semibold">Position Comment:</h3>
          {currentComment ? (
            <p>{currentComment}</p>
          ) : (
            <p>No comment for this position.</p>
          )}
        </div>
      )}
      {isMobile && showAnalysis && (
          <div
            className={cn(
              "fixed left-0 right-0 z-20 bg-gray-800/95 p-2 text-white transition-all duration-300 ease-in-out",
              "bottom-0 max-h-[15dvh] overflow-y-auto"
            )}>
            <PositionAnalysis
              evaluation={chessApiEvaluation}
              isConnected={isConnected}
              isLoading={isAnalysisLoading}
              isMobile={isMobile}
            />
          </div>
        )}
    </div>
  );
};

export default ChessboardBot;
