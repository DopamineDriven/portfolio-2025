"use client";

import type { Square } from "chess.js";
import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Dests, Key } from "chessground/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessground } from "chessground";
import { useGame } from "@/contexts/game-context";
import "./base.css";
import "./brown.css";
import "./cburnett.css";

export type ChessInstance = InstanceType<typeof Chess>;

interface ChessboardProps {
  onSquareRightClickAction: (square: Square) => void;
  customSquareStyles?: Record<string, React.CSSProperties>;
}

export default function Chessboard({
  onSquareRightClickAction,
  customSquareStyles
}: ChessboardProps) {

  const {
    game,
    playerColor,
    isPlayerTurn,
    lastMove,
    makeMove,
    getMoveOptions
  } = useGame();

  const [_optionSquares, setOptionSquares] = useState<
    Record<string, React.CSSProperties>
  >({});

  const apiRef = useRef<Api | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (from: Square, to: Square) => {
      makeMove({ from, to });
      setOptionSquares({});
    },
    [makeMove]
  );

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (!isPlayerTurn) return;
      const options = getMoveOptions(square);
      setOptionSquares(options);
    },
    [isPlayerTurn, getMoveOptions]
  );

  const getLegalMoves = useCallback((chess: ChessInstance): Dests => {
    const dests = new Map<Key, Key[]>();
    chess.moves({ verbose: true }).forEach(move => {
      const moves = dests.get(move.from as Key) ?? [];
      moves.push(move.to as Key);
      dests.set(move.from as Key, moves);
    });
    return dests;
  }, []);

  const chessColorHelper = useCallback(
    (val: "b" | "w" | "white" | "black"): "white" | "black" => {
      return val === "b" || val === "black" ? "black" : "white";
    },
    []
  );

  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        const vw = Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        );
        const size = vw < 640 ? vw : Math.min(vw * 0.4, 480); // 40vw up to a max of 480px
        boardRef.current.style.width = `${size}px`;
        boardRef.current.style.height = `${size}px`;
      }
    };

    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, []);

  useEffect(() => {
    console.log("Board orientation:", chessColorHelper(playerColor));
    const config: Config = {
      fen: game.fen(),
      orientation: chessColorHelper(playerColor),
      coordinates: true,
      coordinatesOnSquares: false,
      autoCastle: true,
      turnColor: chessColorHelper(game.turn()),
      movable: {
        free: false,
        color: isPlayerTurn ? chessColorHelper(playerColor) : "both", // Allow both colors to move
        dests: getLegalMoves(game),
        events: {
          after: handleMove
        }
      },
      draggable: {
        enabled: true,
        showGhost: true
      },
      highlight: {
        lastMove: true,
        check: true
      },
      premovable: {
        enabled: false
      },
      predroppable: {
        enabled: false
      },
      selectable: {
        enabled: true
      },
      events: {
        select: handleSquareClick as (key: Key) => void
      },
      check: game.isCheck(),
      lastMove: lastMove
    };

    if (boardRef.current) {
      if (apiRef.current) {
        apiRef.current.destroy();
      }
      apiRef.current = Chessground(boardRef.current, config);

      // Apply custom styles
      if (customSquareStyles) {
        Object.entries(customSquareStyles).forEach(([square, style]) => {
          const squareEl = boardRef.current!.querySelector(
            `[data-key="${square}"]`
          )! as HTMLElement;
          if (squareEl) {
            Object.assign(squareEl.style, style);
          }
        });
      }

      // Add right-click event listener
      boardRef.current.addEventListener("contextmenu", e => {
        e.preventDefault();
        const square = (e.target as HTMLElement).closest(".square");
        if (square) {
          const key = square.getAttribute("data-key") as Square;
          onSquareRightClickAction(key);
        }
      });
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
      }
    };
  }, [
    game,
    playerColor,
    isPlayerTurn,
    lastMove,
    handleMove,
    getLegalMoves,
    makeMove,
    handleSquareClick,
    customSquareStyles,
    onSquareRightClickAction,
    chessColorHelper
  ]);

  return (
    <div
      ref={boardRef}
      className="aspect-square w-full overflow-hidden rounded-lg sm:w-[40vw] sm:max-w-[480px]"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.5) 0px 4px 12px"
      }}
    />
  );
}
