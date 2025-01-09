"use client";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key, Dests } from "chessground/types";
import { useCallback, useEffect, useRef } from "react";
import { Chess, Color } from "chess.js";
import { Chessground } from "chessground";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

interface ChessboardProps {
  position: string;
  onMoveAction: (from: string, to: string) => void;
  playerColor: Color;
  orientation: "white" | "black";
  isPlayerTurn: boolean;
  check: boolean;
  lastMove?: [Key, Key];
}



export default function Chessboard({
  position,
  onMoveAction,
  playerColor,
  orientation,
  isPlayerTurn,
  check,
  lastMove
}: ChessboardProps) {
  const apiRef = useRef<Api | null>(null);
  const chessRef = useRef<InstanceType<typeof Chess>>(new Chess(position));

  // Calculate legal moves for the current position
  const getLegalMoves = useCallback((chess: InstanceType<typeof Chess>) => {
    const dests = new Map<Key, Key[]>();
    chess.moves({ verbose: true }).forEach(move => {
      const moves = dests.get(move.from) ?? Array.of<Key>();
      moves.push(move.to);
      dests.set(move.from, moves);
    });
    return dests satisfies Dests;
  }, []);

  const handleMove = useCallback(
    (orig: Key, dest: Key) => {
      const chess = chessRef.current;
      const move = chess.move({ from: orig, to: dest });
      if (move) {
        onMoveAction(orig, dest);
      }
    },
    [onMoveAction]
  );

  useEffect(() => {
    const chess = new Chess(position);
    chessRef.current = chess;
    const chessColorHelper = (val: "b" | "w") => val === "b" ? "black" : "white";

    const config: Config = {

      fen: position,
      orientation: orientation,
      coordinates: true,
      coordinatesOnSquares: false,
autoCastle: true,
      turnColor: chessColorHelper(chess.turn()),
      movable: {
        free: false,
        color: chessColorHelper(chess.turn()),
        dests: isPlayerTurn ? getLegalMoves(chess) : undefined,
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
        lastMove: false,
        check: true
      },
      premovable: {showDests: true,castle: true,
        enabled: true
      },
      predroppable: {
        enabled: false
      },
      selectable: {
        enabled: true
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
    handleMove
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
