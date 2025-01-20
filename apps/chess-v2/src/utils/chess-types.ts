import type { Move, PieceSymbol, Square } from "chess.js";



export type ChessColor = "w" | "b" | "white" | "black";

export function toChessJSColor(color: ChessColor) {
  if (color === "w" || color === "b") return color;
  return color === "white" ? "w" : "b";
}

export function toChessgroundColor(color: ChessColor) {
  if (color === "white" || color === "black") return color;
  return color === "w" ? "white" : "black";
}

type InferResult<V> = V extends `${infer U}`
  ? U extends "w" | "b" | "white" | "black"
    ? true
    : false
  : false;

export function isValidChessColor<const T extends string>(
  color: T
): InferResult<T> {
  return /(\b(w|b|white|black)\b)/gm.test(color) as InferResult<T>;
}
export interface HistoryVerboseEntity {
  before: string; // FEN Notation
  after: string; // FEN Notation
  color: "w" | "b";
  piece: PieceSymbol;
  from: Square;
  to: Square;
  /**
   * Single character flags are derived from the following object
   *
   * ```ts
   * declare const FLAGS: {
      NORMAL: "n";
      CAPTURE: "c";
      BIG_PAWN: "b";
      EP_CAPTURE: "e";
      PROMOTION: "p";
      KSIDE_CASTLE: "k";
      QSIDE_CASTLE: "q";
    };
    ```
    *
    */
  flags: string;
  san: string;
  lan: `${Square}${Square}`;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
}

function _HistoryVerboseHelper(moves: Move[]) {
  // the last index in the array contains the most recent move made
  // each move made with history verbose returns conditionally defined captured and promotion fields
  const l = moves.length;

  const getLastIndex = moves.at(l - 1);
  if (getLastIndex) {
    getLastIndex.before;
  }
}

/**
 * [
  {
    "color": "w",
    "piece": "p",
    "from": "d2",
    "to": "d4",
    "san": "d4",
    "flags": "b",
    "lan": "d2d4",
    "before": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "after": "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1"
  }
]
 */
