"use client";

import type { Square } from "chess.js";
import type { Key } from "chessground/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { RotateCcw } from "lucide-react";
import type { StockfishDifficulty } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { getStockfishDifficulty } from "@/types/chess";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import { GameSettings } from "@/ui/game-settings";
import MoveHistory from "@/ui/move-history";
import { toChessgroundColor, toChessJSColor } from "@/utils/chess-types";
import { Engine } from "@/utils/engine";

interface ChessboardBotProps {
  initialSettings: GameSettings;
  difficulty: StockfishDifficulty;
  onRestart: () => void;
}

export interface OptionSquares {
  [key: string]: {
    background: string;
    borderRadius: string;
  };
}

export interface RightClickedSquares {
  [key: string]:
    | {
        backgroundColor: string;
      }
    | undefined;
}

const ChessboardBot: React.FC<ChessboardBotProps> = ({
  initialSettings,
  difficulty,
  onRestart
}) => {
  const engine = useMemo(() => new Engine(), []);
  const [game, setGame] = useState<Chess>(new Chess());
  const [playerColor, _setPlayerColor] = useState<ChessColor>(() => {
    if (initialSettings.playerColor === "random") {
      return Math.random() < 0.5 ? "white" : "black";
    }
    // Ensure we're using chessground format for the board
    return initialSettings.playerColor === "w"
      ? "white"
      : initialSettings.playerColor === "b"
        ? "black"
        : initialSettings.playerColor;
  });
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(() => {
    const chessJSColor = toChessJSColor(playerColor);
    return chessJSColor === "w";
  });
  const [lastMove, setLastMove] = useState<[Key, Key] | undefined>(undefined);
  const [optionSquares, setOptionSquares] = useState<OptionSquares>({});
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const [moves, setMoves] = useState<string[]>([]);

  useEffect(() => {
    if (playerColor === "black") {
      makeStockfishMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerColor]);

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setGameResult(game.turn() === "w" ? "Black wins!" : "White wins!");
      } else if (game.isDraw()) {
        setGameResult("It's a draw!");
      } else {
        setGameResult("Game over!");
      }
      setShowGameModal(true);
    }
  }, [game]);

  const makeStockfishMove = useCallback(() => {
    if (game.isGameOver()) return;

    setIsPlayerTurn(false);
    const stockfishLevel = getStockfishDifficulty(difficulty);

    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const move = game.move({
          from,
          to,
          promotion: bestMove.substring(4, 5) as
            | "q"
            | "r"
            | "b"
            | "n"
            | undefined
        });

        if (move) {
          setGame(new Chess(game.fen()));
          setLastMove([from as Key, to as Key]);
          setIsPlayerTurn(true);
          setMoves(prev => [...prev, move.san]);
        }
      }
    });
  }, [engine, game, difficulty]);

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: OptionSquares = {};
    moves.forEach(move => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to)?.color !== game.get(square)?.color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%"
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
      borderRadius: ""
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(from: Exclude<Key, "a0">, to: Exclude<Key, "a0">) {
    if (!isPlayerTurn) return;

    setRightClickedSquares({});

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from, to, promotion: "q" });

    if (move) {
      setGame(gameCopy);
      setLastMove([from as Key, to as Key]);
      setOptionSquares({});
      setIsPlayerTurn(false);
      setMoves(prev => [...prev, move.san]);
      setTimeout(makeStockfishMove, 300);
    } else {
      getMoveOptions(from);
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = "rgba(255, 0, 0, 0.5)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square]?.backgroundColor === colour
          ? undefined
          : { backgroundColor: colour }
    });
  }

  return (
    <div className="relative flex gap-8">
      <div>
        <Button
          variant="outline"
          size="icon"
          className="absolute -top-12 right-0"
          onClick={onRestart}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Chessboard
          position={game.fen()}
          onMoveAction={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          playerColor={toChessgroundColor(playerColor)}
          orientation={toChessgroundColor(playerColor)}
          isPlayerTurn={isPlayerTurn}
          check={game.isCheck()}
          lastMove={lastMove}
          customSquareStyles={{
            ...optionSquares,
            ...rightClickedSquares
          }}
        />
      </div>
      <div className="flex-1">
        <MoveHistory moves={moves} />
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
                  setGame(new Chess());
                  setShowGameModal(false);
                  setGameResult(null);
                  setIsPlayerTurn(toChessJSColor(playerColor) === "w");
                  setLastMove(undefined);
                  setOptionSquares({});
                  setRightClickedSquares({});
                  setMoves([]);
                  if (playerColor === "black") {
                    setTimeout(makeStockfishMove, 300);
                  }
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
