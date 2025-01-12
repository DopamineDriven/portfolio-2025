"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from "react";
import { Chess, Move, Square } from "chess.js";
import { Key } from "chessground/types";
import {
  getStockfishDifficulty,
  StockfishDifficulty,
  StockfishMode
} from "@/types/chess";
import { ChessColor, toChessJSColor } from "@/utils/chess-types";

export interface ShortMove {
  from: string; // The square the piece is moving from (e.g., "e2")
  to: string; // The square the piece is moving to (e.g., "e4")
  promotion?: string; // The piece to promote to (if applicable) (e.g., "q")
}

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

interface GameState {
  game: Chess;
  isPlayerTurn: boolean;
  lastMove?: [Key, Key];
  playerColor: ChessColor;
  moves: Move[];
  gameOver: boolean;
  gameResult: string | null;
  difficulty: StockfishDifficulty;
  mode: StockfishMode;
}

type GameAction =
  | { type: "MAKE_MOVE"; move: ShortMove | Move }
  | { type: "SET_PLAYER_COLOR"; color: ChessColor }
  | { type: "SET_GAME_OVER"; result: string }
  | { type: "RESET_GAME" }
  | { type: "SET_LAST_MOVE"; move: [Key, Key] }
  | { type: "SET_DIFFICULTY"; difficulty: StockfishDifficulty }
  | { type: "SET_MODE"; mode: StockfishMode };

interface GameContextType extends GameState {
  makeMove: (move: ShortMove) => void;
  makeStockfishMove: () => void;
  resetGame: () => void;
  setPlayerColor: (color: ChessColor) => void;
  setDifficulty: (difficulty: StockfishDifficulty) => void;
  setMode: (mode: StockfishMode) => void;
  getMoveOptions: (square: Square) => {
    [square: string]: { background: string; borderRadius: string };
  };
  engine: Engine;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MAKE_MOVE": {
      const moveResult = state.game.move(action.move);
      if (!moveResult) return state;

      return {
        ...state,
        isPlayerTurn: !state.isPlayerTurn,
        lastMove: [moveResult.from as Key, moveResult.to as Key],
        moves: state.game.history({ verbose: true }),
        gameOver: state.game.isGameOver(),
        gameResult: state.game.isGameOver()
          ? state.game.isCheckmate()
            ? `${state.game.turn() === "w" ? "Black" : "White"} wins!`
            : state.game.isDraw()
              ? "It's a draw!"
              : "Game over!"
          : null
      };
    }
    case "SET_PLAYER_COLOR":
      return {
        ...state,
        playerColor: action.color,
        isPlayerTurn: toChessJSColor(action.color) === "w",
        game: new Chess(),
        moves: []
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
    case "SET_DIFFICULTY":
      return {
        ...state,
        difficulty: action.difficulty
      };
    case "SET_MODE":
      return {
        ...state,
        mode: action.mode
      };
    default:
      return state;
  }
}

export function GameProvider({
  children,
  initialColor,
  initialDifficulty,
  initialMode
}: {
  children: React.ReactNode;
  initialColor: ChessColor;
  initialDifficulty: StockfishDifficulty;
  initialMode: StockfishMode;
}) {
  const engine = useMemo(() => new Engine(), []);
  const initialGame = useMemo(() => new Chess(), []);

  const [state, dispatch] = useReducer(gameReducer, {
    game: initialGame,
    isPlayerTurn: toChessJSColor(initialColor) === "w",
    playerColor: initialColor,
    moves: [],
    gameOver: false,
    gameResult: null,
    difficulty: initialDifficulty,
    mode: initialMode
  });

  const makeMove = useCallback((move: ShortMove): void => {
    dispatch({ type: "MAKE_MOVE", move });
  }, []);

  const makeStockfishMove = useCallback(() => {
    if (state.gameOver) return;

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion =
          bestMove.length > 4
            ? (bestMove.substring(4, 5) as "n" | "b" | "r" | "q")
            : undefined;

        makeMove({ from, to, promotion });
      }
    });

    engine.evaluatePosition(
      state.game.fen(),
      getStockfishDifficulty(state.difficulty)
    );
  }, [engine, state.game, state.gameOver, state.difficulty, makeMove]);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const setPlayerColor = useCallback((color: ChessColor) => {
    dispatch({ type: "SET_PLAYER_COLOR", color });
  }, []);

  const setDifficulty = useCallback((difficulty: StockfishDifficulty) => {
    dispatch({ type: "SET_DIFFICULTY", difficulty });
  }, []);

  const setMode = useCallback((mode: StockfishMode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const getMoveOptions = useCallback(
    (square: Square) => {
      const moves = state.game.moves({
        square,
        verbose: true
      });
      if (moves.length === 0) {
        return {};
      }

      const newSquares: {
        [square: string]: { background: string; borderRadius: string };
      } = {};
      moves.forEach(move => {
        newSquares[move.to] = {
          background:
            state.game.get(move.to) &&
            state.game.get(move.to)!.color !== state.game.get(square)!.color
              ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
          borderRadius: "50%"
        };
      });
      newSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
        borderRadius: ""
      };
      return newSquares;
    },
    [state.game]
  );

  const value = {
    ...state,
    makeMove,
    makeStockfishMove,
    resetGame,
    setPlayerColor,
    setDifficulty,
    setMode,
    getMoveOptions,
    engine
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
