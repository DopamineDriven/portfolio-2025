export const PIECE_VALUES = {
  p: 1, // pawn
  n: 3, // knight
  b: 3, // bishop
  r: 5, // rook
  q: 9, // queen
  k: 0 // king (not counted in material score)
} as const;

export type PieceType = keyof typeof PIECE_VALUES;

export type MaterialCount = Record<keyof typeof PIECE_VALUES, number>;

export type CapturedPiecesProps = {
  white: MaterialCount;
  black: MaterialCount;
};

export const handlePieceIcons = (target: keyof typeof PIECE_VALUES) => {
  switch (target) {
    case "b": {
      return "Bishop";
    }
    case "k": {
      return "King";
    }
    case "n": {
      return "Knight";
    }
    case "p": {
      return "Pawn";
    }
    case "q": {
      return "Queen";
    }
    default: {
      return "Rook";
    }
  }
};
