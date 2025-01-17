"use client";

import type { Move, Square } from "chess.js";
import type { Comment as PgnComment, ShortMove } from "chess.js/index";
import type { Key } from "chessground/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Chess } from "chess.js";
import type { ChessApiMessage } from "@/hooks/use-chess-api";
import type { SoundKeys } from "@/lib/sound";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { CapturedPieces, MaterialCount } from "@/types/values";
import type { ChessColor } from "@/utils/chess-types";
import { useChessApi } from "@/hooks/use-chess-api";
import { playSound } from "@/lib/sound";
import { getStockfishDifficulty } from "@/types/chess";
import { PIECE_VALUES } from "@/types/values";
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
  public evaluatePositionInfinite(
    fen: string,
    difficulty: number,
    elo: number
  ) {
    // "position fen <fen>" gives Stockfish context on the current board configuration/position
    this.sendMessage(`position fen ${fen}`);
    this.sendMessage(`setoption name UCI_LimitStrength value true`);
    this.sendMessage(`setoption name UCI_Elo value ${elo}`);
    // set difficulty 0-20
    this.sendMessage(`setoption name Skill Level value ${difficulty}`);
    // let Stockfish search for best move endlessly until "stop" command is sent

    this.sendMessage("go infinite");
  }

  // "go movetime"
  public evaluatePositionMovetime(
    fen: string,
    elo: number,
    difficulty: number,
    movetime: number
  ) {
    // "position fen <fen>" gives Stockfish context on the current board configuration/position
    this.sendMessage(`position fen ${fen}`);
    this.sendMessage(`setoption name UCI_LimitStrength value true`);
    this.sendMessage(`setoption name UCI_Elo value ${elo}`);
    // set difficulty 0-20
    this.sendMessage(`setoption name Skill Level value ${difficulty}`);

    this.sendMessage(`go movetime ${movetime}`);
  }

  public skillLevel(difficulty: number) {
    // set difficulty 0-20
    this.sendMessage(`setoption name Skill Level value ${difficulty}`);
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
  capturedPieces: CapturedPieces;
  materialScore: {
    white: number;
    black: number;
  };
  currentMoveIndex: number;
  moveHistory: Move[];
  comments: PgnComment[];
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
  goToMove: (index: number) => void;
  canGoForward: boolean;
  canGoBackward: boolean;
  goForward: () => void;
  goBackward: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  getComment: () => string | undefined;
  getComments: () => PgnComment[];
  chessApiEvaluation: ChessApiMessage | null;
  requestChessApiEvaluation: () => void;
  isConnected: boolean;
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
    promotionSquare: null,
    capturedPieces: {
      white: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 },
      black: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 }
    },
    materialScore: {
      white: 0,
      black: 0
    },
    currentMoveIndex: -1,
    moveHistory: [],
    comments: []
  });

  const [selectedMode, setSelectedMode] = useState(initialMode);

  const [isSoundEnabled, setIsSoundEnabled] = useState(soundEnabled);

  const [selectedDifficulty, setSelectedDifficulty] =
    useState(initialDifficulty);

  const lastProcessedMoveRef = useRef<string | null>(null);

  const chessColorHelper = useCallback(
    (val: "b" | "w" | "white" | "black"): "white" | "black" => {
      return val === "b" || val === "black" ? "black" : "white";
    },
    []
  );

  const { sendPosition, lastMessage, isConnected } = useChessApi();
  const [chessApiEvaluation, setChessApiEvaluation] =
    useState<ChessApiMessage | null>(null);

  useEffect(() => {
    if (lastMessage && lastMessage.type === "bestmove") {
      setChessApiEvaluation(lastMessage);
    }
  }, [lastMessage]);

  const requestChessApiEvaluation = useCallback(() => {
    sendPosition(game.fen());
  }, [game, sendPosition]);

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

  const calculateMaterialScore = useCallback(
    (capturedPieces: CapturedPieces) => {
      const getScore = (pieces: MaterialCount) => {
        const score = Object.entries(pieces).reduce((total, [piece, count]) => {
          const pieceType = piece.toLowerCase() as keyof typeof PIECE_VALUES;
          console.log(
            "[getScore] piece:",
            piece,
            "count:",
            count,
            "value:",
            PIECE_VALUES[pieceType]
          );
          return total + PIECE_VALUES[pieceType] * count;
        }, 0);
        console.log("[getScore] total score:", score);
        return score;
      };

      // Calculate raw scores
      console.log("[calculateMaterialScore] captured pieces:", capturedPieces);
      const whiteScore = getScore(capturedPieces.black); // pieces white has captured
      const blackScore = getScore(capturedPieces.white); // pieces black has captured

      console.log(
        "[calculateMaterialScore] whiteScore:",
        whiteScore,
        "blackScore:",
        blackScore
      );
      return {
        white: whiteScore,
        black: blackScore
      };
    },
    []
  );

  const makeMove = useCallback(
    (move: ShortMove): void => {
      const moveString = move.promotion
        ? `${move.from}${move.to}${move.promotion}`
        : `${move.from}${move.to}`;
      if (moveString === lastProcessedMoveRef.current) {
        console.log("[makeMove] Skipping duplicate move:", moveString);
        return;
      }
      lastProcessedMoveRef.current = moveString;
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
          const newCapturedPieces = { ...prevState.capturedPieces };
          const newMaterialScore = { ...prevState.materialScore };

          if (moveResult.captured) {
            const capturer = moveResult.color === "w" ? "white" : "black";
            const targetSide = capturer === "white" ? "black" : "white";
            const capturedPiece = moveResult.captured;

            newCapturedPieces[targetSide] = {
              ...newCapturedPieces[targetSide],
              [capturedPiece]:
                (newCapturedPieces[targetSide][capturedPiece] || 0) + 1
            };

            const calculatedScore = calculateMaterialScore(newCapturedPieces);
            newMaterialScore.white = calculatedScore.white;
            newMaterialScore.black = calculatedScore.black;
          }

          // Create a new moves array without duplicates
          const existingMoves = [...prevState.moves];
          const previousMove = existingMoves[prevState.moveCounter - 1];

          // Only add the move if it's different from the last move or it's the first move
          if (previousMove !== moveResult.san || existingMoves.length === 0) {
            existingMoves[prevState.moveCounter] = moveResult.san;
          }

          const newMoveHistory = [...prevState.moveHistory, moveResult];
          const newComments = game.getComments();
          return {
            ...prevState,
            isPlayerTurn: chessColorHelper(newGame.turn()) === initialColor,
            lastMove: [moveResult.from as Key, moveResult.to as Key],
            moves: existingMoves,
            moveCounter: prevState.moveCounter + 1,
            gameOver: newGame.isGameOver(),
            gameResult: getGameResult(newGame, prevState.playerColor),
            capturedPieces: newCapturedPieces,
            materialScore: newMaterialScore,
            moveHistory: newMoveHistory,
            currentMoveIndex: newMoveHistory.length - 1,
            comments: newComments
          };
        });
      }
    },
    [
      game,
      chessColorHelper,
      initialColor,
      state.isPlayerTurn,
      playSoundEffect,
      calculateMaterialScore
    ]
  );

  const getGameResult = (game: Chess, playerColor: ChessColor) => {
    if (game.isCheckmate()) {
      if (game.turn() === toChessJSColor(playerColor)) {
        return "Stockfish wins!" as const;
      } else return "You win!" as const;
    } else if (game.isDraw()) {
      return "It's a draw!" as const;
    } else if (
      game.isStalemate() ||
      game.isThreefoldRepetition() ||
      game.isInsufficientMaterial()
    ) {
      return "Stalemate!" as const;
    } else if (game.isGameOver()) {
      return "Game over!" as const;
    }
    return null;
  };

  const makeStockfishMove = useCallback(() => {
    if (state.gameOver || state.isPlayerTurn === true) return;
    const difficulty = getStockfishDifficulty(state.difficulty);

    const roundedEloValue = (difficulty: number) => {
      const toModulo = (difficulty * 107.5) % 50;
      if (toModulo !== 0) {
        return difficulty * 107.5 + (50 - toModulo);
      } else return difficulty * 107.5;
    };

    const elo = roundedEloValue(difficulty);

    const getDefaultPonderTime = (difficulty: number) => {
      return Math.min(Math.max(difficulty * 0.25, 1), 10) * 250;
    };
    // (1) send the desired skill level
    // engine.skillLevel(difficulty);

    // (2) Listen for best move
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

    // (3) set isPondering to true
    setState(prev => ({ ...prev, isPondering: true }));

    // (4) "go infinite"
    engine.evaluatePositionInfinite(game.fen(), difficulty, elo);

    // (5) Stop Stockfish analysis for best move once "ponder time" elapses
    setTimeout(() => {
      engine.stop();
      setState(prev => ({ ...prev, isPondering: false }));
    }, getDefaultPonderTime(difficulty));
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
      gameResult: null,
      promotionSquare: null,
      capturedPieces: {
        white: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 },
        black: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 }
      },
      materialScore: { white: 0, black: 0 },
      currentMoveIndex: -1,
      moveHistory: [],
      comments: []
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
    (newDifficulty: StockfishDifficulty) => {
      console.log(
        `setDifficulty useCallback`,
        newDifficulty,
        `initialDifficulty`,
        initialDifficulty
      );
      if (newDifficulty !== initialDifficulty) {
        setSelectedDifficulty(newDifficulty);
      }
      setState(prevState => ({ ...prevState, newDifficulty }));
      engine.skillLevel(getStockfishDifficulty(newDifficulty));
    },
    [engine, initialDifficulty]
  );

  const setMode = useCallback(
    (newMode: StockfishMode) => {
      if (newMode !== initialMode) {
        setSelectedMode(newMode);
      }
      setState(prevState => ({ ...prevState, newMode }));
    },
    [initialMode]
  );

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

  const goToMove = useCallback(
    (index: number) => {
      if (index >= -1 && index < state.moveHistory.length) {
        const newGame = new Chess();
        const newCapturedPieces = {
          white: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 },
          black: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 }
        } satisfies CapturedPieces;
        for (let i = 0; i <= index; i++) {
          const move = state.moveHistory[i];
          if (move) {
            newGame.move(move);
            if (move.captured) {
              const capturer = move.color === "w" ? "white" : "black";
              const targetSide = capturer === "white" ? "black" : "white";
              newCapturedPieces[targetSide] = {
                ...newCapturedPieces[targetSide],
                [move.captured]:
                  (newCapturedPieces[targetSide][move.captured] ?? 0) + 1
              };
            }
          }
        }
        const newMaterialScore = calculateMaterialScore(newCapturedPieces);
        const newComments = newGame.getComments();
        setGame(newGame);
        setState(prevState => ({
          ...prevState,
          currentMoveIndex: index,
          isPlayerTurn:
            newGame.turn() === toChessJSColor(prevState.playerColor),
          capturedPieces: newCapturedPieces,
          materialScore: newMaterialScore,
          comments: newComments
        }));
      }
    },
    [state.moveHistory, setGame, calculateMaterialScore]
  );

  const goForward = useCallback(() => {
    if (state.currentMoveIndex < state.moveHistory.length - 1) {
      goToMove(state.currentMoveIndex + 1);
    }
  }, [state.currentMoveIndex, state.moveHistory.length, goToMove]);

  const goBackward = useCallback(() => {
    if (state.currentMoveIndex > -1) {
      goToMove(state.currentMoveIndex - 1);
    }
  }, [state.currentMoveIndex, goToMove]);

  const canGoForward = state.currentMoveIndex < state.moveHistory.length - 1;

  const canGoBackward = state.currentMoveIndex > -1;

  const undo = useCallback(() => {
    if (state.currentMoveIndex > -1) {
      goToMove(state.currentMoveIndex - 1);
    }
  }, [state.currentMoveIndex, goToMove]);

  const redo = useCallback(() => {
    if (state.currentMoveIndex < state.moveHistory.length - 1) {
      goToMove(state.currentMoveIndex + 1);
    }
  }, [state.currentMoveIndex, state.moveHistory.length, goToMove]);

  const canUndo = state.currentMoveIndex > -1;

  const canRedo = state.currentMoveIndex < state.moveHistory.length - 1;

  const getComment = useCallback(() => {
    return game.getComment();
  }, [game]);

  const getComments = useCallback(() => {
    return game.getComments();
  }, [game]);
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
    handlePromotion,
    goToMove,
    canGoForward,
    canGoBackward,
    goForward,
    goBackward,
    undo,
    canUndo,
    redo,
    canRedo,
    mode: selectedMode,
    difficulty: selectedDifficulty,
    getComment,
    getComments,
    chessApiEvaluation,
    requestChessApiEvaluation,
    isConnected
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
