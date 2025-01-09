"use client";

import type { Square } from "chess.js";
import type {
  BoardOrientation,
  PromotionPieceOption
} from "react-chessboard/dist/chessboard/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { Engine } from "@/utils/engine";

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

const ChessboardBot: React.FC = () => {
  const engine = useMemo(() => new Engine(), []);
  const [game, setGame] = useState<InstanceType<typeof Chess>>(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] =
    useState<RightClickedSquares>({});
  const [optionSquares, setOptionSquares] = useState<OptionSquares>({});
  const searchParams = useSearchParams();
  const stockfishLevel = Number.parseInt(
    searchParams.get("stockfishLevel") ?? "10",
    10
  );
  const playAs = searchParams.get("playAs") ?? "white";
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const [boardWidth, setBoardWidth] = useState(560);
  const [isPlayerTurn, setIsPlayerTurn] = useState(playAs === "white");

  const makeStockfishMove = useCallback(() => {
    if (game.isGameOver()) return;

    setIsPlayerTurn(false);
    engine.evaluatePosition(game.fen(), stockfishLevel);
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const move = game.move({
          from: bestMove.substring(0, 2) as Square,
          to: bestMove.substring(2, 4) as Square,
          promotion: bestMove.substring(4, 5) as
            | "q"
            | "r"
            | "b"
            | "n"
            | undefined
        });

        if (move) {
          setGame(new Chess(game.fen()));
          setIsPlayerTurn(true);
        }
      }
    });
  }, [engine, game, stockfishLevel]);

  useEffect(() => {
    if (playAs === "black") {
      makeStockfishMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playAs]);

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

  function onSquareClick(square: Square) {
    if (!isPlayerTurn) return;

    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    if (!moveTo) {
      const moves = game.moves({ square: moveFrom, verbose: true });
      const foundMove = moves.find(m => m.to === square);
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        setMoveFrom(hasMoveOptions ? square : null);
        return;
      }

      setMoveTo(square);

      if (
        game.get(moveFrom)?.type === "p" &&
        ((game.get(moveFrom)?.color === "w" && square[1] === "8") ||
          (game.get(moveFrom)?.color === "b" && square[1] === "1"))
      ) {
        setShowPromotionDialog(true);
        return;
      }

      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q"
      });

      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);
      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      setTimeout(makeStockfishMove, 300);
    }
  }

  function onPromotionPieceSelect(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) {
    if (piece) {
      const gameCopy = new Chess(game.fen());
      gameCopy.move({
        from: (promoteFromSquare ??= moveFrom!),
        to: (promoteToSquare ??= moveTo!),
        promotion: piece?.[1]?.toLowerCase() ?? "q"
      });
      setGame(gameCopy);
      setTimeout(makeStockfishMove, 300);
      return true;
    }

    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return false;
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

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setBoardWidth(260);
      } else if (screenWidth < 960) {
        setBoardWidth(400);
      } else {
        setBoardWidth(560);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Chessboard
        animationDuration={200}
        arePiecesDraggable={false}
        boardOrientation={playAs as BoardOrientation}
        position={game.fen()}
        boardWidth={boardWidth}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
        }}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
      />
      {showGameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-4">
            <h2 className="mb-2 text-xl font-bold">{gameResult}</h2>
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => {
                setGame(new Chess());
                setShowGameModal(false);
                setGameResult(null);
                setIsPlayerTurn(playAs === "white");
                if (playAs === "black") {
                  setTimeout(makeStockfishMove, 300);
                }
              }}>
              New Game
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChessboardBot;
