"use client";

import type { Key } from "chessground/types";
import type { CSSProperties, FC } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { Chess, Square } from "chess.js";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  History,
  Info,
  Lightbulb,
  RotateCcw
} from "lucide-react";
import { useChessWebSocketContext } from "@/contexts/chess-websocket-context";
import { useGame } from "@/contexts/game-context";
import { cn } from "@/lib/utils";
import { AnalyzeAdvantage } from "@/ui/analyze-advantage/temp";
import { Button } from "@/ui/atoms/button";
import ChatWidget from "@/ui/chat-widget";
import Chessboard from "@/ui/chessboard";
import ChessboardUser from "@/ui/chessboard-user";
import { EvalBar } from "@/ui/eval-bar";
import { EvalBarMobile } from "@/ui/eval-bar-mobile";
import MoveHistory from "@/ui/move-history";
import MoveHistoryBar from "@/ui/move-history-bar";
import PositionAnalysis from "@/ui/position-analysis";

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
    difficulty,
    mode,
    canGoForward,
    canGoBackward,
    goForward,
    goBackward,
    getComment,
    isNavigatingHistory,
    game,
    setIsNavigatingHistoryExplicitly
  } = useGame();

  const { isConnected, chessApiEvaluation, requestChessApiEvaluation } =
    useChessWebSocketContext();

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

  const [showHint, setShowHint] = useState(false);

  const [showAnalysis, setShowAnalysis] = useState(true);

  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const [hintSquares, setHintSquares] = useState<Map<Key, string>>(
    new Map<Key, string>()
  );

  const [evalScore, setEvalScore] = useState(50);

  useEffect(() => {
    if (chessApiEvaluation?.eval && evalScore !== chessApiEvaluation.eval) {
      setEvalScore(chessApiEvaluation.eval);
    }
    console.log(evalScore);
  }, [evalScore, chessApiEvaluation]);

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
    if (!isPlayerTurn && !gameOver && !isNavigatingHistory) {
      setTimeout(() => {
        makeStockfishMove();
        clearHighlights();
      }, 300);
    }
  }, [
    isPlayerTurn,
    gameOver,
    makeStockfishMove,
    clearHighlights,
    isNavigatingHistory
  ]);

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

  useEffect(() => {
    requestChessApiEvaluation(game);
  }, [game, requestChessApiEvaluation]);

  function squaresOnPath(game: Chess, from: Square, to: Square) {
    const piece = game.get(from);
    if (!piece) return Array.of<Square>();

    const path = Array.of<Square>();

    const fromFile = from.charCodeAt(0); // e.g. "e" => 101
    const fromRank = parseInt(from[1]!);
    const toFile = to.charCodeAt(0);
    const toRank = parseInt(to[1]!);

    const fileDiff = toFile - fromFile;
    const rankDiff = toRank - fromRank;

    // Check if king is castling
    if (piece.type === "k" && Math.abs(fileDiff) === 2 && rankDiff === 0) {
      // short castle => from e1 -> g1  (white) or e8 -> g8 (black)
      // long castle  => from e1 -> c1  (white) or e8 -> c8 (black)

      // If short castle => highlight just the square in between (f1 or f8)
      // If long castle => highlight the two squares in between (d1,c1 or d8,c8)
      //  (the final square "c1"/"c8" is your "hint-to," so often you highlight
      //   the squares between e & c: that’s d1 plus also c1 if you like)

      if (fileDiff === 2) {
        // short castle
        const midFile = fromFile + 1; // e->f
        const midSquare = String.fromCharCode(midFile) + fromRank;
        path.push(midSquare as Square);
      } else {
        // long castle => fileDiff === -2
        const midFile1 = fromFile - 1; // e->d
        const midFile2 = fromFile - 2; // e->c
        const midSquare1 = String.fromCharCode(midFile1) + fromRank;
        const midSquare2 = String.fromCharCode(midFile2) + fromRank;

        // Typically you'd highlight `d1` as an “in‐between,”
        // but `c1` is your final “hint-to.”
        // If you also want c1 in the “path,” just push it here too:
        path.push(midSquare1 as Square); // d1
        path.push(midSquare2 as Square); // c1
      }
      return path;
    }

  // EN PASSANT detection
  // Typically you'd check if "moveResult.flags.includes('e')"
  // but here we can do a quick check:
  if (
    piece.type === "p" &&
    // Pawn moves diagonally by 1 file & 1 rank
    Math.abs(fileDiff) === 1 &&
    Math.abs(rankDiff) === 1 &&
    // And the destination square is actually empty
    // (the captured pawn is on the side but same rank as from)
    !game.get(to)
  ) {
    // The captured pawn’s square is the "toFile" + "fromRank"
    const capturedSquare =
      String.fromCharCode(toFile) + fromRank.toString() as Square;
    // You can add this to your path or as a separate highlight
    path.push(capturedSquare);
    return path;
  }

    // Double‐step pawn (p) move (e2->e4)
    if (piece.type === "p" && fileDiff === 0 && Math.abs(rankDiff) === 2) {
      const step = rankDiff / 2; // +1 if white is going up, -1 if black going down
      const midRank = fromRank + step;
      const midSquare = String.fromCharCode(fromFile) + midRank;
      path.push(midSquare as Square);
      return path;
    }

    // Sliding pieces (rook (r), bishop (b), queen (q))
    if (["r", "b", "q"].includes(piece.type)) {
      const fileDirection = Math.sign(fileDiff);
      const rankDirection = Math.sign(rankDiff);

      let currentFile = fromFile + fileDirection;
      let currentRank = fromRank + rankDirection;

      // step until we arrive at (toFile,toRank)
      while (currentFile !== toFile || currentRank !== toRank) {
        const sq: Square = (String.fromCharCode(currentFile) +
          currentRank.toString()) as Square;
        path.push(sq);
        currentFile += fileDirection;
        currentRank += rankDirection;
      }
      return path;
    }

    // Knights (n), single‐step kings (k), single‐step pawns (p) -> no intermediate squares
    return path;
  }

  const handleShowHint = useCallback(() => {
    if (!chessApiEvaluation?.from && !chessApiEvaluation?.to) return;
    const { from, to } = chessApiEvaluation;

    const newHintSquares = new Map<Key, string>();
    newHintSquares.set(from as Key, "hint-from");
    newHintSquares.set(to as Key, "hint-to");
    squaresOnPath(
      game,
      from as Square,
      to as Square
    ).forEach(sq => {
      newHintSquares.set(sq as Key, "hint-path");
    });
    setHintSquares(newHintSquares);
    setShowHint(true);
  }, [chessApiEvaluation, game]);

  useEffect(() => {
    if (chessApiEvaluation) {
      setIsAnalysisLoading(false);
    }
  }, [chessApiEvaluation]);

  const handleHideHint = useCallback(() => {
    setHintSquares(new Map<Key, string>());
    setShowHint(false);
  }, []);

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

  useEffect(() => {
    console.log(`[difficulty:mode]: ${difficulty}:${mode}`);
  }, [difficulty, mode]);
  return (
    <div className="mx-auto h-auto w-[min(90dvh,100dvw)]! sm:w-[min(90dvh,95dvw)]! sm:px-2 lg:px-4">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="mx-auto w-full">
          {isMobile ? (
            <div className="w-full sm:hidden">
              <MoveHistoryBar />
            </div>
          ) : (
            <MoveHistory />
          )}
          <ChessboardUser
            target="Stockfish"
            capturedPieces={capturedPieces}
            materialScore={materialScore}
            playerColor={playerColor}
            playerCountry={country}
          />
          {!isMobile && isPondering && (
            <div className="absolute left-12 top-4 inline-flex items-center justify-center">
              <h3 className="font-sans text-xl font-bold text-gray-100">
                <Brain className="motion-preset-spin stroke-gray-100 motion-loop-infinite" />
              </h3>
            </div>
          )}
          <div className="relative w-full">
            {isMobile && (
              <EvalBarMobile
                playerColor={playerColor}
                evalScore={evalScore}
                isMobile={isMobile}
              />
            )}
            <Chessboard
              onSquareRightClickAction={onSquareRightClick}
              customSquareStyles={
                {
                  ...optionSquares,
                  ...rightClickedSquares
                } as Record<string, CSSProperties>
              }
              customHighlights={showHint ? hintSquares : new Map<Key, string>()}
              clearHighlightsAction={clearHighlights}>
              {!isMobile && (
                <EvalBar
                  playerColor={playerColor}
                  evalScore={evalScore}
                  isMobile={isMobile}
                  evaluation={chessApiEvaluation}
                />
              )}
            </Chessboard>
          </div>
          <ChessboardUser
            capturedPieces={capturedPieces}
            materialScore={materialScore}
            playerColor={playerColor}
            target="Player"
            playerCountry={country}>
            <div className="flex w-full flex-row justify-end space-x-2 text-right">
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
              {isMobile && (
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
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleGoBackward}
                disabled={!canGoBackward}>
                <ChevronLeft className="h-6 w-6 stroke-primary" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className=""
                onClick={handleGoForward}
                disabled={!canGoForward}>
                <ChevronRight className="h-6 w-6 stroke-primary" />
              </Button>
            </div>
          </ChessboardUser>
        </div>
      </div>
      {!isMobile && <AnalyzeAdvantage />}
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
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white p-6 motion-preset-confetti  motion-duration-[5000ms]">
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
                className="w-full text-primary">
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
      {isReviewMode && !isMobile && (
        <div
          className={cn(
            "z-20 flex flex-row bg-gray-800/95 p-2 text-white transition-all duration-300 ease-in-out",
            "max-h-[12.5dvh] overflow-y-auto sm:w-[min(90dvh,95dvw)]!"
          )}>
          <PositionAnalysis
            evaluation={chessApiEvaluation}
            isConnected={isConnected}
            isLoading={isAnalysisLoading}
            isMobile={isMobile}
          />
        </div>
      )}
      {isMobile && showAnalysis && (
        <div
          className={cn(
            "fixed left-0 right-0 z-20 bg-gray-800/95 p-2 text-white transition-all duration-300 ease-in-out",
            "bottom-0 max-h-[12.5dvh] overflow-y-auto"
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
