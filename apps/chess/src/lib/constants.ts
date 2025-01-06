import { Board, Piece, PieceColor, PieceType } from "@/types/chess";

export const BOARD_SIZE = 8;

export const PIECE_VALUES = {
  pawn: 1,
  bishop: 3,
  knight: 3,
  rook: 5,
  queen: 9,
  king: 0 // King has no point value as it cannot be captured
} as const;

// Helper function to create typed pieces
function createPiece(type: PieceType, color: PieceColor): Piece {
  return { type, color };
}

// Create typed arrays for each row
const createBackRow = (color: PieceColor): Piece[] => [
  createPiece("rook", color),
  createPiece("knight", color),
  createPiece("bishop", color),
  createPiece("queen", color),
  createPiece("king", color),
  createPiece("bishop", color),
  createPiece("knight", color),
  createPiece("rook", color)
];

const createPawnRow = (color: PieceColor): Piece[] =>
  Array<Piece>(BOARD_SIZE).fill(createPiece("pawn", color));

const createEmptyRow = (): (Piece | null)[] =>
  Array<null>(BOARD_SIZE).fill(null);

export const INITIAL_BOARD: Board = [
  createBackRow("black"),
  createPawnRow("black"),
  createEmptyRow(),
  createEmptyRow(),
  createEmptyRow(),
  createEmptyRow(),
  createPawnRow("white"),
  createBackRow("white")
];
