import type { Color as ChessJSColor } from "chess.js";
import type { Color as ChessgroundColor } from "chessground/types";

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
