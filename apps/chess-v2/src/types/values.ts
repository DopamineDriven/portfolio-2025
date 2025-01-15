export const PIECE_VALUES = {
  p: 1, // pawn
  n: 3, // knight
  b: 3, // bishop
  r: 5, // rook
  q: 9, // queen
  k: 0 // king (not counted in material score)
} as const;

export type PieceType = keyof typeof PIECE_VALUES;

export type MaterialCount = {
  [key: string]: number;
};

export type CapturedPieces = {
  white: MaterialCount;
  black: MaterialCount;
};
