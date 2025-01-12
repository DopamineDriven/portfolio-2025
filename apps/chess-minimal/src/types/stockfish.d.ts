
declare module "stockfish" {
  // Basic shape of Stockfish factory function returning a WebAssembly worker-like interface
  export default function Stockfish(): Worker;
}

export {};
