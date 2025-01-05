import type { Unenumerate } from "@/types/helpers";

export const piecesArr = [
  "bishop",
  "king",
  "knight",
  "pawn",
  "queen",
  "rook"
] as const;

export const pieceColorArr = ["white", "black"] as const;

export type PieceType = Unenumerate<typeof piecesArr>;
export type PieceColor = Unenumerate<typeof pieceColorArr>;


export const piecesObj = {
  type: piecesArr.reduce(val => val),
  color: pieceColorArr.reduce(val => val)
};

export type Piece = typeof piecesObj;

export type MapPiece = {
  [P in keyof Piece]: Piece[P];
};

export type Board = (Piece | null)[][];

export type GameState = {
  board: Board;
  currentPlayer: PieceColor;
  selectedSquare: [number, number] | null;
  possibleMoves: [number, number][];
  isCheck: boolean;
  isCheckmate: boolean;
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  score: {
    white: number;
    black: number;
  };
};

export type GameAction =
  | { type: "SELECT_SQUARE"; payload: [number, number] }
  | { type: "RESET_GAME" };
