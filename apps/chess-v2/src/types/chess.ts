import type { Color, Key } from "chessground/types";

export type Dests = Map<Key, Key[]>;

export type ChessboardProps = {
  position: string;
  onMoveAction: (from: string, to: string) => void;
};

export type ColorExtended = Color | "random";

export type DifficultyOptions = "challenge" | "friendly" | "assisted";

export interface UserGameSettings {
  playerColor: ColorExtended;
  difficulty: StockfishDifficulty;
}

// export const files = (["a", "b", "c", "d", "e", "f", "g", "h"] as const).reduce(
//   p => p
// );
// export const ranks = (["1", "2", "3", "4", "5", "6", "7", "8"] as const).reduce(
//   p => p
// );

// export type MyKey = "a0" | `${typeof files}${typeof ranks}`;

export const stockfishDifficulty = {
  beginner: 3,
  intermediate: 6,
  expert: 12
} as const;

export const getStockfishDifficulty = <
  const T extends keyof typeof stockfishDifficulty
>(
  target: T
) => {
  return stockfishDifficulty[target];
};

export type StockfishDifficulty = keyof typeof stockfishDifficulty;

export type StockfishMode = "challenge" | "friendly" | "assisted";

export const pieceImgObj = {
  black_bishop:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-bishop.svg",
  black_king:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-king.svg",
  black_knight:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-knight.svg",
  black_pawn:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-pawn.svg",
  black_queen:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-queen.svg",
  black_rook:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-rook.svg",
  white_bishop:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-bishop.svg",
  white_king:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-king.svg",
  white_knight:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-knight.svg",
  white_pawn:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-pawn.svg",
  white_queen:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-queen.svg",
  white_rook:
    "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-rook.svg"
} as const;
