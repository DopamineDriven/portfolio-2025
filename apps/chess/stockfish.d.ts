// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/stockfish/src/stockfish-nnue-16.js" />

import Stockfish from "stockfish/src/stockfish-nnue-16.js";

declare module "stockfish" {
  export default Stockfish;
}

// declare module 'stockfish' {
//   export default function STOCKFISH(): Worker;
// }

export {};
