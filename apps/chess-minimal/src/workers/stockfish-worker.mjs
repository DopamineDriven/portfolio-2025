"use client";
/// <reference lib="webworker" />

/**
 * @type {Worker | undefined}
 */
let engine;

// This will be our worker’s event listener.
/**
 * @param {keyof WindowEventMap} type - The type of event to listen for.
 * @param {MessageEvent<string>} event - The function to call when the event occurs.
 * @param {boolean | AddEventListenerOptions} [options] - Optional configuration for the listener.
 */
addEventListener(
  "message",
  (
    /**
     * @type {MessageEvent<{type: string; payload: Record<string, any> | string;}>}
     */
    event
  ) => {
    const { type, payload } = event.data;

    engine = new Worker("/stockfish/stockfish.js");
    switch (type) {
      case "INIT_ENGINE": {
        // Relay any messages from Stockfish to the main thread
        engine.onmessage = (
          /**
           * @type {MessageEvent<string>}
           */
          event
        ) => {
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
  }
);
