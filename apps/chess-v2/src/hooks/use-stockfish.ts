"use client";

import { useCallback, useEffect, useState } from "react";

export function useStockfish() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [engineOutput, setEngineOutput] = useState<string | null>(null);

  useEffect(() => {
    let stockfishWorker: Worker | null = null;

    const initializeWorker = () => {
      try {
        stockfishWorker = new Worker("/stockfish.js");
        setWorker(stockfishWorker);

        stockfishWorker.onmessage = (e: MessageEvent<string>) => {
          const message = e.data;
          if (message === "uciok") {
            setIsReady(true);
          } else {
            setEngineOutput(message);
          }
        };

        stockfishWorker.onerror = error => {
          console.error("Stockfish worker error:", error);
          setWorker(null);
          setIsReady(false);
        };
      } catch (error) {
        console.error("Failed to initialize Stockfish worker:", error);
        setWorker(null);
        setIsReady(false);
      }
    };

    initializeWorker();

    return () => {
      if (stockfishWorker) {
        stockfishWorker.terminate();
      }
    };
  }, []);

  const sendCommand = useCallback(
    (command: string) => {
      if (worker && isReady) {
        worker.postMessage(command);
      } else {
        console.warn("Stockfish worker is not ready");
      }
    },
    [worker, isReady]
  );

  return { isReady, sendCommand, engineOutput };
}
