import type { Color, Key } from "chessground/types";

export type Dests = Map<Key, Key[]>;

export type ChessboardProps = {
  position: string;
  onMoveAction: (from: string, to: string) => void;
};

export type ColorExtended = Color | "random";

export type DifficultyOptions = "challenge" | "friendly" | "assisted";

export interface UserGameSettings {
  playerColor: ColorExtended
  difficulty: StockfishDifficulty
}

// export const files = (["a", "b", "c", "d", "e", "f", "g", "h"] as const).reduce(
//   p => p
// );
// export const ranks = (["1", "2", "3", "4", "5", "6", "7", "8"] as const).reduce(
//   p => p
// );

// export type MyKey = "a0" | `${typeof files}${typeof ranks}`;

export const stockfishDifficulty = {
  beginner: 2,
  intermediate: 6,
  expert: 12
} as const;

export const getStockfishDifficulty = (
  target: keyof typeof stockfishDifficulty
) => {
  return stockfishDifficulty[target];
};

export type StockfishDifficulty = keyof typeof stockfishDifficulty;
