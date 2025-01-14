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
import type { SoundKeys } from "@/lib/sound";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { playSound } from "@/lib/sound";
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
        const bestMove = d?.match(/bestmove\s+(\S+)/)?.[1];
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
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }
  public newGame() {
    this.sendMessage("ucinewgame");
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
  promotionSquare: { from: Square; to: Square } | null;
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
  playSoundEffect: (effect: SoundKeys) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  handlePromotion: (from: Square, to: Square) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);
type GameProviderProps = {
  children: React.ReactNode;
  initialColor: ChessColor;
  initialDifficulty: StockfishDifficulty;
  initialMode: StockfishMode;
  soundEnabled: boolean;
};

export function GameProvider({
  children,
  initialColor,
  soundEnabled,
  initialDifficulty,
  initialMode
}: GameProviderProps) {
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
    isPondering: false,
    promotionSquare: null
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState(soundEnabled);

  const chessColorHelper = useCallback(
    (val: "b" | "w" | "white" | "black"): "white" | "black" => {
      return val === "b" || val === "black" ? "black" : "white";
    },
    []
  );

  const playSoundEffect = useCallback(
    (effect: SoundKeys) => {
      if (isSoundEnabled) {
        playSound(effect);
      }
    },
    [isSoundEnabled]
  );
  const handlePromotion = useCallback((from: Square, to: Square) => {
    setState(prev => ({
      ...prev,
      promotionSquare: { from, to }
    }));
  }, []);
  const makeMove = useCallback(
    (move: ShortMove): void => {
      const newGame = new Chess(game.fen());
      const moveResult = newGame.move(move);
      if (moveResult) {
        // Determine the type of sound to play
        if (newGame.isGameOver()) {
          playSoundEffect("game-end");
        } else if (newGame.isCheck()) {
          playSoundEffect("move-check");
        } else if (moveResult.captured) {
          playSoundEffect("capture");
        } else if (
          moveResult.flags.includes("k") ||
          moveResult.flags.includes("q")
        ) {
          playSoundEffect("castle");
        } else if (moveResult.flags.includes("p")) {
          playSoundEffect("promote");
        } else {
          playSoundEffect(state.isPlayerTurn ? "move-self" : "move-opponent");
        }
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
    [game, chessColorHelper, initialColor, state.isPlayerTurn, playSoundEffect]
  );

  const getGameResult = (game: Chess, playerColor: ChessColor) => {
    if (game.isCheckmate()) {
      if (game.turn() === toChessJSColor(playerColor)) {
        return "Stockfish wins!" as const;
      } else return "You win!" as const;
    } else if (game.isDraw()) {
      return "It's a draw!" as const;
    } else if (game.isStalemate()) {
      return "Stalemate!" as const;
    } else if (game.isGameOver()) {
      return "Game over!" as const;
    }
    return null;
  };

  const makeStockfishMove = useCallback(() => {
    if (state.gameOver || state.isPlayerTurn === true) return;

    const getDefaultPonderTime = (difficulty: number) => {
      return Math.min(Math.max(difficulty * 0.25, 1), 10) * 500;
    };

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        console.log(bestMove);
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
    engine.newGame();
    playSoundEffect("game-start");
  }, [engine, playSoundEffect]);

  const setPlayerColor = useCallback(
    (color: ChessColor) => {
      setState(prevState => ({
        ...prevState,
        playerColor: color,
        isPlayerTurn: toChessJSColor(color) === "w"
      }));
      resetGame();
    },
    [resetGame]
  );

  const setDifficulty = useCallback(
    (difficulty: StockfishDifficulty) => {
      setState(prevState => ({ ...prevState, difficulty }));
      engine.sendMessage(
        `setoption name Skill Level value ${getStockfishDifficulty(difficulty)}`
      );
      engine.newGame();
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
    isSoundEnabled,
    playSoundEffect,
    setIsSoundEnabled,
    setMode,
    getMoveOptions,
    engine,
    handlePromotion
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
