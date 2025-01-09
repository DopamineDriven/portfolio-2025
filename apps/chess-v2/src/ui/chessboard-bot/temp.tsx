"use client";

import type { Square } from "chess.js";
import type { Key } from "chessground/types";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { RotateCcw } from "lucide-react";
import type { UserGameSettings } from "@/types/chess";
import { getStockfishDifficulty } from "@/types/chess";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import { Engine } from "@/utils/engine";

interface ChessboardBotProps {
  initialSettings: UserGameSettings;
  onRestartAction: () => void;
}

const ChessboardBot: FC<ChessboardBotProps> = ({
  initialSettings,
  onRestartAction: onRestart
}) => {
  const engine = useMemo(() => new Engine(), []);
  const [game, setGame] = useState<InstanceType<typeof Chess>>(new Chess());
  const [playerColor, _setPlayerColor] = useState<"white" | "black">(() => {
    // Update: Using ColorExtended
    if (initialSettings.playerColor === "random") {
      return Math.random() < 0.5 ? "white" : "black";
    }
    return initialSettings.playerColor;
  });
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(playerColor === "white");
  const [lastMove, setLastMove] = useState<[Key, Key] | undefined>(undefined);
  const makeStockfishMove = useCallback(() => {
    if (game.isGameOver()) return;

    setIsPlayerTurn(false);
    const stockfishLevel = getStockfishDifficulty(initialSettings.difficulty);

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
        }
      }
    });
  }, [engine, game, initialSettings.difficulty]);
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

  const onMoveAction = useCallback(
    (from: string, to: string) => {
      const move = game.move({
        from: from as Square,
        to: to as Square,
        promotion: "q"
      });
      if (move) {
        setGame(new Chess(game.fen()));
        setLastMove([from as Key, to as Key]);
        setTimeout(makeStockfishMove, 300);
      }
    },
    [game, makeStockfishMove]
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute -top-12 right-0"
        onClick={onRestart}>
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Chessboard
        position={game.fen()}
        onMoveAction={onMoveAction}
        playerColor={playerColor}
        orientation={playerColor}
        isPlayerTurn={isPlayerTurn}
        check={game.isCheck()}
        lastMove={lastMove}
      />
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
                  setIsPlayerTurn(playerColor === "white");
                  setLastMove(undefined);
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
