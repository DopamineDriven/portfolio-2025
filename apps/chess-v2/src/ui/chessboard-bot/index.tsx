"use client";

import type { Square } from "chess.js";
import type { Key } from "chessground/types";
import type { CSSProperties, FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { RotateCcw } from "lucide-react";
import type { StockfishDifficulty } from "@/types/chess";
import type { GameSettingsEntity } from "@/ui/game-settings";
import type { ChessColor } from "@/utils/chess-types";
import { getStockfishDifficulty } from "@/types/chess";
import { Button } from "@/ui/atoms/button";
import Chessboard from "@/ui/chessboard";
import MoveHistory from "@/ui/move-history";
import { toChessgroundColor, toChessJSColor } from "@/utils/chess-types";

class Engine {
  private stockfish: Worker | null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
    this.onMessage = this.onMessage.bind(this);

    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.stockfish) {
      this.stockfish.addEventListener("message", (e: MessageEvent<string>) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
        console.log(`[evaluating-best move]: ${bestMove}`);
        callback({ bestMove: bestMove ?? "" });
      });
    }
  }

  evaluatePosition(fen: string, depth: number) {
    console.log(`[evaluating-position]: \nfen:${fen} \ndepth:${depth}`);
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }

  stop() {
    this.sendMessage("stop");
  }

  quit() {
    this.sendMessage("quit");
  }

  private sendMessage(message: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    }
  }
}

interface ChessboardBotProps {
  initialSettings: GameSettingsEntity;
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

const ChessboardBot: FC<ChessboardBotProps> = ({
  initialSettings,
  difficulty,
  onRestart
}) => {
  const engine = useMemo(() => new Engine(), []);
  const [game, setGame] = useState<InstanceType<typeof Chess>>(new Chess());
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
    } else {
      setGameResult("You Resigned!");
    }
    setMoves(game.history());
  }, [game]);

  const makeStockfishMove = useCallback(() => {
    if (game.isGameOver()) return;

    setIsPlayerTurn(false);
    const stockfishLevel = getStockfishDifficulty(difficulty);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const gameCopy = new Chess(game.fen());
        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion =
          bestMove.length > 4
            ? (bestMove.substring(4, 5) as "q" | "r" | "b" | "n")
            : undefined;

        const move = gameCopy.move({ from, to, promotion });

        if (move) {
          setGame(gameCopy);
          setLastMove([from as Key, to as Key]);
          setIsPlayerTurn(true);
          setMoves(gameCopy.history());
        }
      }
    });

    engine.evaluatePosition(game.fen(), stockfishLevel);
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

  function onSquareClick(from: Square, to: Square) {
    if (!isPlayerTurn) return;

    setRightClickedSquares({});

    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(from);
    const isPromotion =
      piece?.type === "p" &&
      ((piece.color === "w" && to.endsWith("8")) ||
        (piece.color === "b" && to.endsWith("1")));

    let move;
    if (isPromotion) {
      // For simplicity, we're auto-promoting to queen.
      // In a full implementation, you'd want to show a dialog for piece selection.
      move = gameCopy.move({ from, to, promotion: "q" });
    } else {
      move = gameCopy.move({ from, to });
    }

    if (move) {
      setGame(gameCopy);
      setLastMove([from as Key, to as Key]);
      setOptionSquares({});
      setIsPlayerTurn(false);
      setMoves(gameCopy.history());
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
          onMoveAction={onSquareClick as (from: Key, to: Key) => void}
          onSquareRightClickAction={onSquareRightClick}
          playerColor={toChessgroundColor(playerColor)}
          orientation={toChessgroundColor(playerColor)}
          isPlayerTurn={isPlayerTurn}
          check={game.isCheck()}
          lastMove={lastMove}
          customSquareStyles={
            {
              ...optionSquares,
              ...rightClickedSquares
            } as Record<string, CSSProperties>
          }
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
