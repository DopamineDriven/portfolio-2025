import {
  Board,
  CastlingRights,
  Piece,
  PieceColor,
  PieceType
} from "@/types/chess";

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

export const INITIAL_CASTLING_RIGHTS = {
  whiteKingside: true,
  whiteQueenside: true,
  blackKingside: true,
  blackQueenside: true
} satisfies CastlingRights;

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

export const CASTLING_POSITIONS = {
  white: {
    kingside: {
      king: { from: [7, 4], to: [7, 6] },
      rook: { from: [7, 7], to: [7, 5] }
    },
    queenside: {
      king: { from: [7, 4], to: [7, 2] },
      rook: { from: [7, 0], to: [7, 3] }
    }
  },
  black: {
    kingside: {
      king: { from: [0, 4], to: [0, 6] },
      rook: { from: [0, 7], to: [0, 5] }
    },
    queenside: {
      king: { from: [0, 4], to: [0, 2] },
      rook: { from: [0, 0], to: [0, 3] }
    }
  }
} as const;
