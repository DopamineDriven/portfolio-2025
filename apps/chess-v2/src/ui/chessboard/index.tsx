"use client";

import type { Square } from "chess.js";
import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import { useCallback, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessground } from "chessground";
import type { ChessColor } from "@/utils/chess-types";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

export type ChessInstance = InstanceType<typeof Chess>;

interface ChessboardProps {
  position: string;
  onMoveAction: (from: Key, to: Key) => void;
  onSquareRightClickAction: (square: Square) => void;
  playerColor: ChessColor;
  orientation: "white" | "black";
  isPlayerTurn: boolean;
  check: boolean;
  lastMove?: [Key, Key];
  customSquareStyles?: Record<string, React.CSSProperties>;
}

type Dests = Map<Key, Key[]>;

export default function Chessboard({
  position,
  onMoveAction,
  onSquareRightClickAction,
  playerColor,
  orientation,
  isPlayerTurn,
  check,
  lastMove,
  customSquareStyles
}: ChessboardProps) {
  const apiRef = useRef<Api | null>(null);
  const chessRef = useRef<ChessInstance>(new Chess(position));

  // Calculate legal moves for the current position
  const getLegalMoves = useCallback(
    (chess: ChessInstance): Dests => {
      const dests = new Map<Key, Key[]>();
      if (!isPlayerTurn) return dests;

      chess.moves({ verbose: true }).forEach(move => {
        if (
          chess.get(move.from)?.color ===
          (playerColor === "white" || playerColor === "w" ? "w" : "b")
        ) {
          const moves = dests.get(move.from as Key) ?? [];
          moves.push(move.to as Key);
          dests.set(move.from as Key, moves);
        }
      });
      return dests;
    },
    [isPlayerTurn, playerColor]
  );

  const handleMove = useCallback(
    (orig: Key, dest: Key) => {
      if (!isPlayerTurn) return;

      const chess = chessRef.current;
      const piece = chess.get(orig as Square);
      if (
        piece?.color !==
        (playerColor === "white" || playerColor === "w" ? "w" : "b")
      )
        return;

      const move = chess.move({ from: orig, to: dest });
      if (move) {
        onMoveAction(orig, dest);
      }
    },
    [onMoveAction, isPlayerTurn, playerColor]
  );

  useEffect(() => {
    const chess = new Chess(position);
    chessRef.current = chess;
    const chessColorHelper = (val: "b" | "w" | "white" | "black") =>
      val === "b" ? "black" : val === "w" ? "white" : val;

    const config: Config = {
      fen: position,
      orientation: orientation,
      coordinates: true,
      coordinatesOnSquares: false,
      autoCastle: true,
      turnColor: chessColorHelper(chess.turn()),
      movable: {
        free: false,
        color: isPlayerTurn ? chessColorHelper(playerColor) : undefined,
        dests: getLegalMoves(chess),
        showDests: true,
        rookCastle: true,
        events: {
          after: handleMove
        }
      },
      draggable: {
        enabled: isPlayerTurn,
        showGhost: true
      },
      highlight: {
        lastMove: true,
        check: true
      },
      premovable: {
        enabled: false // Disable premoves to prevent move queuing
      },
      predroppable: {
        enabled: false
      },
      selectable: {
        enabled: isPlayerTurn // Only allow selection when it's player's turn
      },
      check: check,
      lastMove: lastMove
    };

    const el = document.getElementById("chessground");
    if (el) {
      if (apiRef.current) {
        apiRef.current.destroy();
      }
      apiRef.current = Chessground(el, config);

      // Apply custom styles
      if (customSquareStyles) {
        Object.entries(customSquareStyles).forEach(([square, style]) => {
          const squareEl = el.querySelector(
            `[data-key="${square}"]`
          )! as HTMLElement;
          if (squareEl) {
            Object.assign(squareEl.style, style);
          }
        });
      }

      // Add right-click event listener
      el.addEventListener("contextmenu", e => {
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
    position,
    orientation,
    playerColor,
    isPlayerTurn,
    check,
    lastMove,
    getLegalMoves,
    handleMove,
    customSquareStyles,
    onSquareRightClickAction
  ]);

  return (
    <div
      id="chessground"
      className="h-[400px] w-[400px] overflow-hidden rounded-lg"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.5) 0px 4px 12px"
      }}
    />
  );
}
