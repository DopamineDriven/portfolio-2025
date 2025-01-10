/// <reference lib="webworker" />

export function createStockfishWorker() {
  // have to use a dynamic import because of how Next.js handles Web Workers
  return new Worker(
    new URL("../workers/stockfish-worker.mjs", import.meta.url),
    { type: "module" }
  );
}
