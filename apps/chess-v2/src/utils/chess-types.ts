import type { Color as ChessJSColor } from "chess.js";
import type { Color as ChessgroundColor } from "chessground/types";
import type { Square, PieceSymbol, Move } from "chess.js";
export type ChessColor = ChessJSColor | ChessgroundColor;

export function toChessJSColor(color: ChessColor) {
  if (color === "w" || color === "b") return color;
  return color === "white" ? "w" : "b";
}

export function toChessgroundColor(color: ChessColor) {
  if (color === "white" || color === "black") return color;
  return color === "w" ? "white" : "black";
}

type InferResult<V> = V extends `${infer U}` ? U extends "w" | "b" | "white" | "black" ? true : false : false;

export function isValidChessColor<const T extends string>(color: T): InferResult<T> {
  return /(\b(w|b|white|black)\b)/gm.test(color) as InferResult<T>
}
export interface HistoryVerboseEntity {
  before: string; // FEN Notation
  after: string; // FEN Notation
  color: "w" | "b";
  piece: PieceSymbol;
  from: Square;
  to: Square;
  san: string;
  lan: `${Square}${Square}`;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
}

function HistoryVerboseHelper(moves: Move[]) {
  // the last index in the array contains the most recent move made
  // each move made with history verbose returns conditionally defined captured and promotion fields
  const l = moves.length;

  const getLastIndex = moves.at(l-1);
  if (getLastIndex) {
    
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
