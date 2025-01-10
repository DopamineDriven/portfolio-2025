"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Chess, PieceSymbol, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { createStockfishWorker } from "@/utils/create-worker";

// For a real chessboard, you might use a library like 'react-chessboard' or 'chess.ts'

export default function GamePage() {
  const [colorChoice, setColorChoice] = useState<"white" | "black" | "random">(
    "white"
  );

  const [difficulty, setDifficulty] = useState(10);
  const [engineOutput, setEngineOutput] = useState<string[]>([]);
  const [fen, setFen] = useState<string>("start"); // 'start' is a recognized FEN in react-chessboard
  const [game] = useState(new Chess()); // One instance of Chess for the game
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create stockfish worker on mount
    workerRef.current = createStockfishWorker();
    return () => {
      // Cleanup worker on unmount
      workerRef.current?.terminate();
    };
  }, []);

  // ---- Helper: Send a command to engine ----
  const sendCommandToEngine = useCallback((command: string) => {
    workerRef.current?.postMessage({
      type: "SEND_COMMAND",
      payload: { command }
    });
  }, []);

  // ---- Handling the engine’s move ----
  const makeEngineMove = useCallback(
    (bestMove: string) => {
      // bestMove is something like "e2e4", "e7e5", etc.
      const from = bestMove.slice(0, 2) as Square;
      const to = bestMove.slice(2, 4) as Square;
      const promotion = bestMove.slice(4, 5) as PieceSymbol; // sometimes includes a promotion piece

      const moveObj = { from, to, promotion };
      if (promotion) {
        moveObj.promotion = promotion;
      }

      const result = game.move(moveObj);
      if (result) {
        setFen(game.fen());
      }
    },
    [game]
  );

  // ---- Handling user's chessboard moves ----
  const onDrop = (
    sourceSquare: string,
    targetSquare: string,
    promotion?: string
  ) => {
    // Validate user’s move with chess.js
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion });

    if (move === null) {
      // Invalid move
      return false;
    }

    // valid move; update FEN
    setFen(game.fen());

    // send updated position to engine
    sendCommandToEngine(
      `position startpos moves ${game.history({ verbose: false }).join(" ")}`
    );
    // prompt engine to move
    sendCommandToEngine("go depth 15");

    return true;
  };

  // ---- Helper: Initialize Engine ----
  const initEngine = useCallback(() => {
    workerRef.current?.postMessage({
      type: "INIT_ENGINE",
      payload: {
        skillLevel: difficulty
      }
    });
  }, [difficulty]);

  // ---- Start New Game ----
  const startGame = () => {
    // decide user color if 'random'
    const chosenColor =
      colorChoice === "random"
        ? Math.random() < 0.5
          ? "white"
          : "black"
        : colorChoice;

    // reset local Chess instance
    game.reset();
    setFen(game.fen());

    // init engine with chosen skill
    initEngine();

    // send "ucinewgame" and "position startpos" to engine
    sendCommandToEngine("ucinewgame");
    sendCommandToEngine("position startpos");

    // if user is 'black', let engine move first
    if (chosenColor === "black") {
      sendCommandToEngine("go depth 15");
    }
  };

  // Listen to engine responses
  useEffect(() => {
    const worker = workerRef.current;
    if (!worker) return;

    const handleEngineMessage = (e: MessageEvent<any>) => {
      // eslint-disable-next-line
      const { type, payload } = e.data;
      if (type === "ENGINE_OUTPUT") {
        setEngineOutput(prev => [...prev, String(payload)]);
        // If payload includes "bestmove", parse it and make the move on the board
        if (typeof payload === "string" && payload.startsWith("bestmove")) {
          const bestMoveMatch = payload.match(/bestmove\s(\S+)/);
          if (bestMoveMatch?.[1]) {
            const bestMove = bestMoveMatch[1];
            makeEngineMove(bestMove);
          }
        }
      }
    };

    worker.addEventListener("message", handleEngineMessage);
    return () => {
      worker.removeEventListener("message", handleEngineMessage);
    };
  }, [makeEngineMove]);

  return (
    <div
      style={{ padding: "1rem" }}
      className="container h-[80-dvh] max-h-screen">
      <h1>Play vs Stockfish</h1>
      <div>
        <label>Choose Your Color: </label>
        <select
          value={colorChoice}
          onChange={e =>
            setColorChoice(e.target.value as "white" | "black" | "random")
          }>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="random">Random</option>
        </select>
      </div>

      <div>
        <label>Choose Difficulty (1-20): </label>
        <input
          type="number"
          min={1}
          max={20}
          value={difficulty}
          onChange={e => setDifficulty(Number.parseInt(e.target.value))}
        />
      </div>

      <button style={{ marginTop: "0.5rem" }} onClick={startGame}>
        Start Game
      </button>

      {/* Chessboard */}
      <div style={{ marginTop: "2rem" }}>
        <Chessboard
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)"
          }}
          position={fen}
          onPieceDrop={onDrop} // in react-chessboard v4+, use onPieceDrop
          boardOrientation={colorChoice === "black" ? "black" : "white"}
        />
      </div>

      {/* Engine Output */}
      <div style={{ marginTop: "1rem" }}>
        <h2>Engine Output</h2>
        <pre
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem",
            height: "200px",
            overflow: "auto"
          }}>
          {engineOutput.join("\n")}
        </pre>
      </div>
    </div>
  );
}
