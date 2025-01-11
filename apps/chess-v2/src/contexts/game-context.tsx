"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer
} from "react";
import { Chess, Square } from "chess.js";
import { Key } from "chessground/types";
import { getStockfishDifficulty, StockfishDifficulty } from "@/types/chess";
import { ChessColor, toChessJSColor } from "@/utils/chess-types";
import { Engine } from "@/utils/engine";

interface GameState {
  game: Chess;
  isPlayerTurn: boolean;
  lastMove?: [Key, Key];
  playerColor: ChessColor;
  moves: string[];
  gameOver: boolean;
  gameResult: string | null;
}

type GameAction =
  | {
      type: "MAKE_MOVE";
      from: Square;
      to: Square;
      promotion?: "q" | "r" | "b" | "n";
    }
  | { type: "SET_PLAYER_COLOR"; color: ChessColor }
  | { type: "SET_GAME_OVER"; result: string }
  | { type: "RESET_GAME" }
  | { type: "SET_LAST_MOVE"; move: [Key, Key] };

interface GameContextType extends GameState {
  makeMove: (
    from: Square,
    to: Square,
    promotion?: "q" | "r" | "b" | "n"
  ) => void;
  makeStockfishMove: () => void;
  resetGame: () => void;
  setPlayerColor: (color: ChessColor) => void;
  engine: Engine;
  difficulty: StockfishDifficulty;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MAKE_MOVE": {
      const gameCopy = new Chess(state.game.fen());
      const move = gameCopy.move({
        from: action.from,
        to: action.to,
        promotion: action.promotion
      });

      if (!move) return state;

      return {
        ...state,
        game: gameCopy,
        isPlayerTurn: !state.isPlayerTurn,
        lastMove: [action.from as Key, action.to as Key],
        moves: gameCopy.history(),
        gameOver: gameCopy.isGameOver(),
        gameResult: gameCopy.isGameOver()
          ? gameCopy.isCheckmate()
            ? `${gameCopy.turn() === "w" ? "Black" : "White"} wins!`
            : gameCopy.isDraw()
              ? "It's a draw!"
              : "Game over!"
          : null
      };
    }
    case "SET_PLAYER_COLOR":
      return {
        ...state,
        playerColor: action.color,
        isPlayerTurn: toChessJSColor(action.color) === "w"
      };
    case "SET_GAME_OVER":
      return {
        ...state,
        gameOver: true,
        gameResult: action.result
      };
    case "RESET_GAME":
      return {
        ...state,
        game: new Chess(),
        isPlayerTurn: toChessJSColor(state.playerColor) === "w",
        lastMove: undefined,
        moves: [],
        gameOver: false,
        gameResult: null
      };
    case "SET_LAST_MOVE":
      return {
        ...state,
        lastMove: action.move
      };
    default:
      return state;
  }
}

export function GameProvider({
  children,
  initialColor,
  difficulty
}: {
  children: React.ReactNode;
  initialColor: ChessColor;
  difficulty: StockfishDifficulty;
}) {
  const engine = React.useMemo(() => new Engine(), []);

  const [state, dispatch] = useReducer(gameReducer, {
    game: new Chess(),
    isPlayerTurn: toChessJSColor(initialColor) === "w",
    playerColor: initialColor,
    moves: [],
    gameOver: false,
    gameResult: null
  });

  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: "q" | "r" | "b" | "n") => {
      dispatch({ type: "MAKE_MOVE", from, to, promotion });
    },
    []
  );

  const makeStockfishMove = useCallback(() => {
    if (state.gameOver) return;

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion =
          bestMove.length > 4
            ? (bestMove.substring(4, 5) as "q" | "r" | "b" | "n")
            : undefined;

        makeMove(from, to, promotion);
      }
    });
    const getDifficulty = getStockfishDifficulty(difficulty);

    engine.evaluatePosition(state.game.fen(), getDifficulty);
  }, [engine, state.game, state.gameOver, difficulty, makeMove]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const setPlayerColor = useCallback((color: ChessColor) => {
    dispatch({ type: "SET_PLAYER_COLOR", color });
  }, []);

  const value = {
    ...state,
    makeMove,
    makeStockfishMove,
    resetGame,
    setPlayerColor,
    engine,
    difficulty
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (typeof context === "undefined") {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
