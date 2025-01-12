"use client";
/// <reference lib="webworker" />
let engine: Worker | undefined;

interface MessageData {
  type: string;
  payload: Record<string, any> | string;
}

// This will be our worker’s event listener.
addEventListener("message", (event: MessageEvent<MessageData>) => {
  const { type, payload } = event.data;

  engine = new Worker("/stockfish/stockfish.js");
  switch (type) {
    case "INIT_ENGINE": {
      // Relay any messages from Stockfish to the main thread
      engine.onmessage = (event: MessageEvent<string>) => {
        const { data: line } = event;
        postMessage({ type: "ENGINE_OUTPUT", payload: line });
      };

      // Example initialization: set skill level (0-20 in Stockfish, but user range: 1-20)
      engine.postMessage(
        `setoption name Skill Level value ${typeof payload === "string" ? payload : payload.skillLevel}`
      );

      // Wait for further commands from main thread
      break;
    }

    case "SEND_COMMAND": {
      // Forwards a UCI command to the engine
      // e.g. "position startpos moves e2e4 e7e5" or "go depth 15"
      engine.postMessage(
        typeof payload === "string" ? payload : payload.command
      );
      break;
    }

    default:
      break;
  }
});
