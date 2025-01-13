"use client";

import type { Square } from "chess.js";
import type { ShortMove } from "chess.js/index";
import type { Key } from "chessground/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { Chess } from "chess.js";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { getStockfishDifficulty } from "@/types/chess";
import { toChessJSColor } from "@/utils/chess-types";

class Engine {
  private stockfish: Worker | null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
    // this.onMessage = this.onMessage.bind(this);

    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  public onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.stockfish) {
      this.stockfish.onmessage = (e: MessageEvent<string>) => {
        const d = e.data;
        console.log(`[stockfish-data]: ${d}`);
        const bestMove = d?.match(/bestmove\s+(\S+)/)?.[1];
        console.log(`[evaluating-best move]: ${bestMove}`);
        callback({ bestMove: bestMove ?? "" });
      };
    }
  }

  // "go infinite"
  public evaluatePositionInfinite(fen: string) {
    // "position fen <fen>" gives Stockfish context on the current board configuration/position
    this.sendMessage(`position fen ${fen}`);
    // let Stockfish search for best move endlessly until "stop" command is sent
    this.sendMessage("go infinite");
  }

  public evaluatePosition(fen: string, depth: number) {
    console.log(`[evaluating-position]: \nfen:${fen} \ndepth:${depth}`);
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }
  public stop() {
    this.sendMessage("stop");
  }

  public quit() {
    this.sendMessage("quit");
  }

  public sendMessage(message: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    }
  }
}
interface GameState {
  isPlayerTurn: boolean;
  lastMove?: [Key, Key];
  playerColor: ChessColor;
  moves: string[];
  gameOver: boolean;
  gameResult: string | null;
  difficulty: StockfishDifficulty;
  mode: StockfishMode;
  moveCounter: number;
  isPondering: boolean;
}

interface GameContextType extends GameState {
  game: Chess;
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
  const [game, setGame] = useState(() => new Chess());
  const [state, setState] = useState<GameState>({
    isPlayerTurn: toChessJSColor(initialColor) === "w",
    playerColor: initialColor,
    moves: [],
    gameOver: false,
    gameResult: null,
    difficulty: initialDifficulty,
    mode: initialMode,
    moveCounter: 0,
    isPondering: false
  });

  const chessColorHelper = useCallback(
    (val: "b" | "w" | "white" | "black"): "white" | "black" => {
      return val === "b" || val === "black" ? "black" : "white";
    },
    []
  );

  const makeMove = useCallback(
    (move: ShortMove): void => {
      const newGame = new Chess(game.fen());
      const moveResult = newGame.move(move);
      if (moveResult) {
        setGame(newGame);
        setState(prevState => {
          // Get the current move number
          const _moveNumber = Math.floor(prevState.moveCounter / 2) + 1;

          // Create a new moves array without duplicates
          const existingMoves = [...prevState.moves];
          const previousMove = existingMoves[prevState.moveCounter - 1];

          // Only add the move if it's different from the last move or it's the first move
          if (previousMove !== moveResult.san || existingMoves.length === 0) {
            existingMoves[prevState.moveCounter] = moveResult.san;
          }

          return {
            ...prevState,
            isPlayerTurn: chessColorHelper(newGame.turn()) === initialColor,
            lastMove: [moveResult.from as Key, moveResult.to as Key],
            moves: existingMoves,
            moveCounter: prevState.moveCounter + 1,
            gameOver: newGame.isGameOver(),
            gameResult: getGameResult(newGame, prevState.playerColor)
          };
        });
      }
    },
    [game, chessColorHelper, initialColor]
  );

  const getGameResult = (
    game: Chess,
    playerColor: ChessColor
  ): string | null => {
    if (game.isCheckmate()) {
      return game.turn() === toChessJSColor(playerColor)
        ? "Stockfish wins!"
        : "You win!";
    } else if (game.isDraw()) {
      return "It's a draw!";
    } else if (game.isGameOver()) {
      return "Game over!";
    }
    return null;
  };

  const makeStockfishMove = useCallback(() => {
    if (state.gameOver || state.isPlayerTurn === true) return;

    const getDefaultPonderTime = (difficulty: number) => {
      return Math.min(Math.max(difficulty * 0.25, 1), 10) * 1000;
    };

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        console.log(`bestMove: ${bestMove}`);
        const from = bestMove.substring(0, 2) as Square;
        const to = bestMove.substring(2, 4) as Square;
        const promotion =
          bestMove.length > 4
            ? (bestMove.substring(4, 5) as "n" | "b" | "r" | "q")
            : undefined;

        makeMove({ from, to, promotion });
      }
    });
    // Update isPondering to true
    setState(prev => ({ ...prev, isPondering: true }));
    engine.evaluatePositionInfinite(game.fen());

    setTimeout(
      () => {
        engine.stop();
        setState(prev => ({ ...prev, isPondering: false }));
      },
      getDefaultPonderTime(getStockfishDifficulty(state.difficulty))
    );
  }, [
    engine,
    game,
    state.gameOver,
    state.difficulty,
    state.isPlayerTurn,
    makeMove
  ]);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setState(prevState => ({
      ...prevState,
      isPlayerTurn: toChessJSColor(prevState.playerColor) === "w",
      lastMove: undefined,
      moves: [],
      moveCounter: 0,
      gameOver: false,
      gameResult: null
    }));
    engine.sendMessage("ucinewgame");
  }, [engine]);

  const setPlayerColor = useCallback(
    (color: ChessColor) => {
      setState(prevState => ({
        ...prevState,
        playerColor: color,
        isPlayerTurn: toChessJSColor(color) === "w"
      }));
      resetGame();
      engine.sendMessage("ucinewgame");
    },
    [resetGame, engine]
  );

  const setDifficulty = useCallback(
    (difficulty: StockfishDifficulty) => {
      setState(prevState => ({ ...prevState, difficulty }));
      engine.sendMessage(
        `setoption name Skill Level value ${getStockfishDifficulty(difficulty)}`
      );
      engine.sendMessage("ucinewgame");
    },
    [engine]
  );

  const setMode = useCallback((mode: StockfishMode) => {
    setState(prevState => ({ ...prevState, mode }));
  }, []);

  const getMoveOptions = useCallback(
    (square: Square) => {
      const moves = game.moves({
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
            game.get(move.to) &&
            game.get(move.to)!.color !== game.get(square)!.color
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
    [game]
  );

  const value = {
    ...state,
    game,
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
