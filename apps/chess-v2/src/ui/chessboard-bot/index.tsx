"use client";

import type { Square } from "chess.js";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";
import { useGame } from "@/contexts/game-context";

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

export interface OptionSquares {
  [key: string]: {
    background: string;
    borderRadius: string;
  };
}

export interface RightClickedSquares {
  [key: string]: {
    backgroundColor: string;
  } | undefined;
}

const ChessboardBot: React.FC<ChessboardBotProps> = ({ onRestart }) => {
  const {
    gameOver,isPlayerTurn,
    gameResult,
    makeStockfishMove,
    resetGame
  } = useGame();

  const [showGameModal, setShowGameModal] = useState(false);
  const [optionSquares, _setOptionSquares] = useState<OptionSquares>({});
  const [rightClickedSquares, setRightClickedSquares] = useState<RightClickedSquares>({});

  useEffect(() => {
    if (gameOver) {
      setShowGameModal(true);
    }
  }, [gameOver]);

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      setTimeout(makeStockfishMove, 300);
    }
  }, [gameOver, makeStockfishMove, isPlayerTurn]);

  // function getMoveOptions(square: Square) {
  //   const moves = game.moves({
  //     square,
  //     verbose: true
  //   });
  //   if (moves.length === 0) {
  //     setOptionSquares({});
  //     return false;
  //   }

  //   const newSquares: OptionSquares = {};
  //   moves.forEach(move => {
  //     newSquares[move.to] = {
  //       background:
  //         game.get(move.to) &&
  //         game.get(move.to)?.color !== game.get(square)?.color
  //           ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
  //           : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
  //       borderRadius: "50%"
  //     };
  //   });
  //   newSquares[square] = {
  //     background: "rgba(255, 255, 0, 0.4)",
  //     borderRadius: ""
  //   };
  //   setOptionSquares(newSquares);
  //   return true;
  // }

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
          onClick={onRestart}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Chessboard
          onSquareRightClickAction={onSquareRightClick}
          customSquareStyles={{
            ...optionSquares,
            ...rightClickedSquares
          } as Record<string, CSSProperties>}
        />
      </div>
      <div className="flex-1">
        <MoveHistory />
      </div>
      {showGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-900">{gameResult}</h2>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => {
                  resetGame();
                  setShowGameModal(false);
                }}
              >
                New Game
              </Button>
              <Button
                variant="outline"
                onClick={onRestart}
              >
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
