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

export type CastlingRights = {
  whiteKingside: boolean;
  whiteQueenside: boolean;
  blackKingside: boolean;
  blackQueenside: boolean;
};

export type CastlingMove = {
  kingFrom: [number, number];
  kingTo: [number, number];
  rookFrom: [number, number];
  rookTo: [number, number];
};

export const piecesObj = {
  type: piecesArr.reduce(val => val),
  color: pieceColorArr.reduce(val => val)
};

export type Piece = typeof piecesObj;

export type Move = {
  from: [number, number];
  to: [number, number];
  piece: Piece;
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
  castlingRights: CastlingRights;
  lastMove: Move | null;
  promotionSquare: [number, number] | null;
};
export type PromotionPieceType = Exclude<PieceType, "pawn" | "king">;

export type GameAction =
  | { type: "SELECT_SQUARE"; payload: [number, number] }
  | { type: "RESET_GAME" }
  | {
      type: "PROMOTE_PAWN";
      payload: { square: [number, number]; pieceType: PieceType };
    };
