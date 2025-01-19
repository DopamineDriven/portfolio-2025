"use client";

import type { Move, Square } from "chess.js";
import type { Comment as PgnComment, ShortMove } from "chess.js/index";
import { useCallback, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Key } from "chessground/types";
import type { SoundKeys } from "@/lib/sound";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { CapturedPiecesProps, MaterialCount } from "@/types/values";
import type { ChessColor } from "@/utils/chess-types";
import { playSound } from "@/lib/sound";
import { getStockfishDifficulty } from "@/types/chess";
import { PIECE_VALUES } from "@/types/values";
import { toChessJSColor } from "@/utils/chess-types";

// stockfish engine Web Worker
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
  lastMove?: [string, string];
  playerColor: ChessColor;
  moves: string[];
  gameOver: boolean;
  gameResult: string | null;
  difficulty: StockfishDifficulty;
  mode: StockfishMode;
  moveCounter: number;
  isPondering: boolean;
  promotionSquare: { from: Square; to: Square } | null;
  capturedPieces: CapturedPiecesProps;
  materialScore: {
    white: number;
    black: number;
  };
  currentMoveIndex: number;
  moveHistory: Move[];
  comments: PgnComment[];
  isNavigatingHistory: boolean;
  lastMessage: string | null;
}

export function useGameState({
  initialColor,
  initialDifficulty,
  initialMode,
  soundEnabled
}: {
  initialColor: ChessColor;
  initialDifficulty: StockfishDifficulty;
  initialMode: StockfishMode;
  soundEnabled: boolean;
}) {
  // stockfish engine memoization
  const engine = useMemo(() => new Engine(), []);

  // chess instance & core state
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
    comments: [],
    isNavigatingHistory: false,
    lastMessage: null
  });
  const lastProcessedMoveRef = useRef<string | null>(null);

  const [isNavigatingHistory, setIsNavigatingHistory] = useState(false);

  const [isSoundEnabled, setIsSoundEnabled] = useState(soundEnabled);

  const [selectedMode, setSelectedMode] = useState(initialMode);

  const [selectedDifficulty, setSelectedDifficulty] =
    useState(initialDifficulty);

  /**
   * converts chess.js Color type (`b`|`w`) to chessground Color type (`black`|`white`)
   */
  const chessColorHelper = useCallback((val: "b" | "w" | "white" | "black") => {
    return val === "b" || val === "black" ? "black" : "white";
  }, []);

  // sound effect cb
  const playSoundEffect = useCallback(
    (effect: SoundKeys) => {
      if (isSoundEnabled) {
        playSound(effect);
      }
    },
    [isSoundEnabled]
  );

  // handle promotion
  const handlePromotion = useCallback((from: Square, to: Square) => {
    setState(prev => ({
      ...prev,
      promotionSquare: { from, to }
    }));
  }, []);

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


  // calculate material score
  const calculateMaterialScore = useCallback(
    (capturedPieces: CapturedPiecesProps) => {
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
      let moveResult: Move;
      try {
        moveResult = newGame.move(move);
      } catch (error) {
        console.error(
          "Invalid move:",
          typeof error === "string" ? error : JSON.stringify(error, null, 2)
        );
        return;
      }
      if (moveResult) {
        console.log(
          `[[origin:game-context.tsx]]\n[before]: ${moveResult.before} \n [after]: ${moveResult.after}`
        );
        // audio handling
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

          // deduplicated new moves array
          const existingMoves = [...prevState.moves];
          const previousMove = existingMoves[prevState.moveCounter - 1];

          // only add to arr if different from previous move or if first move
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
            comments: newComments,
            isNavigatingHistory: false
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

  // make stockfish move
  const makeStockfishMove = useCallback(() => {
    if (state.gameOver || state.isPlayerTurn === true || isNavigatingHistory)
      return;
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
    makeMove,
    isNavigatingHistory
  ]);

  // reset game
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
      comments: [],
      isNavigatingHistory: false
    }));
    engine.newGame();
    playSoundEffect("game-start");
  }, [engine, playSoundEffect]);

  // set player color
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

  // set selected difficulty
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
    },
    [initialDifficulty]
  );

  // set selected mode
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
        console.log(
          `[[game-context.tsx]] Setting isNavigatingHistory: ${index !== state.moveHistory.length - 1}`
        );
        setIsNavigatingHistory(index !== state.moveHistory.length - 1);
        const newGame = new Chess();

        const newCapturedPieces = {
          white: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 },
          black: { b: 0, k: 0, n: 0, p: 0, q: 0, r: 0 }
        } satisfies CapturedPiecesProps;
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
          comments: newComments,
          isNavigatingHistory: index !== state.moveHistory.length - 1
        }));
        console.log(
          `[[game-context.tsx]] After setState, isNavigatingHistory: ${index !== state.moveHistory.length - 1}`
        );
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

  const canGoForward = useMemo(
    () => state.currentMoveIndex < state.moveHistory.length - 1,
    [state.currentMoveIndex, state.moveHistory.length]
  );

  const canGoBackward = useMemo(
    () => state.currentMoveIndex > -1,
    [state.currentMoveIndex]
  );

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

  const canUndo = useMemo(
    () => state.currentMoveIndex > -1,
    [state.currentMoveIndex]
  );

  const canRedo = useMemo(
    () => state.currentMoveIndex < state.moveHistory.length - 1,
    [state.currentMoveIndex, state.moveHistory.length]
  );

  const getComment = useCallback(() => {
    return game.getComment();
  }, [game]);

  const getComments = useCallback(() => {
    return game.getComments();
  }, [game]);

  const setIsNavigatingHistoryExplicitly = useCallback((value: boolean) => {
    console.log(
      `[[game-context.tsx]] Explicitly setting isNavigatingHistory to ${value}`
    );
    setIsNavigatingHistory(value);
    setState(prevState => ({
      ...prevState,
      isNavigatingHistory: value
    }));
  }, []);

  return {
    // Game state
    ...state,
    game,
    isSoundEnabled,
    mode: selectedMode,
    difficulty: selectedDifficulty,
    // Methods
    setIsSoundEnabled,
    setPlayerColor,
    setDifficulty,
    setMode,
    makeMove,
    makeStockfishMove,
    resetGame,
    canRedo,
    canUndo,
    redo,
    undo,
    canGoBackward,
    canGoForward,
    getMoveOptions,
    handlePromotion,
    goToMove,
    goForward,
    goBackward,
    getComment,
    getComments,
    isNavigatingHistory,
    setIsNavigatingHistoryExplicitly,
    playSoundEffect
  };
}
