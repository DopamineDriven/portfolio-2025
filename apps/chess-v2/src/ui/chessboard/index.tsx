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
import PromotionModal from "@/ui/promotion-modal";

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
    getMoveOptions,
    promotionSquare,
    handlePromotion
  } = useGame();

  const [_optionSquares, setOptionSquares] = useState<
    Record<string, React.CSSProperties>
  >({});
  const apiRef = useRef<Api | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  const handleMove = useCallback(
    (from: Key, to: Key) => {
      const piece = game.get(from as Square);

      const isPromotion =
        piece?.type === "p" &&
        ((piece.color === "w" && to[1] === "8") ||
          (piece.color === "b" && to[1] === "1"));
      if (isPromotion) {
        handlePromotion(from as Square, to as Square);
        setPromotionModalOpen(true);
      } else {
        makeMove({ from: from as Square, to: to as Square });
      }
      setOptionSquares({});
    },
    [makeMove, game, handlePromotion]
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

  const updateBoardSize = useCallback(() => {
    if (boardRef.current && containerRef.current) {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      if (vw >= 640) {
        // sm breakpoint
        // Calculate available height considering the avatar sections (11rem total) and padding
        const availableHeight = vh - 11 * 16 - 32; // 11rem converted to px and 2rem padding
        // Calculate available width considering the side panel
        const availableWidth = vw * 0.8; // 80% of viewport width

        // Use the smaller of the two dimensions to ensure square aspect ratio
        const size = Math.min(availableHeight, availableWidth);

        boardRef.current.style.width = `${size}px`;
        boardRef.current.style.height = `${size}px`;
      } else {
        // Mobile layout - full width
        boardRef.current.style.width = `${vw}px`;
        boardRef.current.style.height = `${vw}px`;
      }
    }
  }, []);

  useEffect(() => {
    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, [updateBoardSize]);

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
    getLegalMoves,
    handleMove,
    makeMove,
    handleSquareClick,
    customSquareStyles,
    onSquareRightClickAction,
    chessColorHelper
  ]);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.set({
        fen: game.fen(),
        turnColor: chessColorHelper(game.turn()),
        movable: {
          color: isPlayerTurn ? chessColorHelper(playerColor) : "both",
          dests: getLegalMoves(game)
        },
        check: game.isCheck()
      });
    }
  }, [game, isPlayerTurn, playerColor, chessColorHelper, getLegalMoves]);

  useEffect(() => {
    if (promotionSquare) {
      setPromotionModalOpen(true);
    }
  }, [promotionSquare]);

  const onPromotion = (piece: "q" | "r" | "b" | "n") => {
    if (promotionSquare) {
      makeMove({
        from: promotionSquare.from,
        to: promotionSquare.to,
        promotion: piece
      });
    }
    setPromotionModalOpen(false);
  };

  return (
    <div ref={containerRef} className="flex w-full items-center justify-center">
      <div
        ref={boardRef}
        className="overflow-hidden rounded-lg"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.5) 0px 4px 12px"
        }}
      />
      <PromotionModal
        isOpen={promotionModalOpen}
        onCloseAction={() => setPromotionModalOpen(false)}
        onPromotionAction={onPromotion}
        color={chessColorHelper(playerColor)}
      />
    </div>
  );
}
