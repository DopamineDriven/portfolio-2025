"use client";

import type { Square } from "chess.js";
import type { CSSProperties, FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";

// class Engine {
//   private stockfish: Worker | null;

//   constructor() {
//     this.stockfish =
//       typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
//     this.onMessage = this.onMessage.bind(this);

//     if (this.stockfish) {
//       this.sendMessage("uci");
//       this.sendMessage("isready");
//     }
//   }

//   onMessage(callback: (data: { bestMove: string }) => void) {
//     if (this.stockfish) {
//       this.stockfish.addEventListener("message", (e: MessageEvent<string>) => {
//         const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
//         console.log(`[evaluating-best move]: ${bestMove}`);
//         callback({ bestMove: bestMove ?? "" });
//       });
//     }
//   }

//   evaluatePosition(fen: string, depth: number) {
//     console.log(`[evaluating-position]: \nfen:${fen} \ndepth:${depth}`);
//     if (this.stockfish) {
//       this.stockfish.postMessage(`position fen ${fen}`);
//       this.stockfish.postMessage(`go depth ${depth}`);
//     }
//   }

//   stop() {
//     this.sendMessage("stop");
//   }

//   quit() {
//     this.sendMessage("quit");
//   }

//   private sendMessage(message: string) {
//     if (this.stockfish) {
//       this.stockfish.postMessage(message);
//     }
//   }
// }

interface ChessboardBotProps {
  onRestart: () => void;
}

export interface RightClickedSquares {
  [key: string]:
    | {
        backgroundColor: string;
      }
    | undefined;
}

const ChessboardBot: FC<ChessboardBotProps> = ({ onRestart }) => {
  const {
    game: _game,
    gameOver,
    gameResult,
    makeStockfishMove,
    resetGame,
    isPlayerTurn,
    getMoveOptions
  } = useGame();

  const [showGameModal, setShowGameModal] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const [optionSquares, setOptionSquares] = useState<
    Record<string, CSSProperties>
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
