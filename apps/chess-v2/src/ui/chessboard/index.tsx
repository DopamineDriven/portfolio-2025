"use client";

import type { Api } from "chessground/api";
import type { Config } from "chessground/config";
import type { Key } from "chessground/types";
import { useCallback, useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessground } from "chessground";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";

export type ChessInstance = InstanceType<typeof Chess>;

interface ChessboardProps {
  position: string;
  onMoveAction: (from: string, to: string) => void;
}

type Dests = Map<Key, Key[]>;

export default function Chessboard({
  position,
  onMoveAction
}: ChessboardProps) {
  const [api, setApi] = useState<Api | null>(null);

  // Calculate legal moves for the current position
  const getLegalMoves = (chess: ChessInstance): Dests => {
    const dests = new Map<Key, Key[]>() satisfies Dests;

    chess.moves({ verbose: true }).forEach(move => {
      const moves = (dests.get(move.from) ?? Array.of<Key>()) satisfies Key[];
      moves.push(move.to);
      dests.set(move.from, moves);
    });
    return dests;
  };

  const handleMove = useCallback(
    (orig: Key, dest: Key) => {
      onMoveAction(orig, dest);
    },
    [onMoveAction]
  );

  useEffect(() => {
    const chess = new Chess(position);

    const config = {
      fen: position,
      movable: {
        free: false,
        color: "white",
        dests: getLegalMoves(chess),
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
      }
    } satisfies Config;

    const el = document.getElementById("chessground");
    if (el) {
      if (api) {
        api.destroy();
      }
      const chessgroundApi = Chessground(el, config);
      setApi(chessgroundApi);
    }

    return () => {
      if (api) {
        api.destroy();
      }
    };
  }, [position, handleMove, api]);

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
