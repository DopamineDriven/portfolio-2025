"use client";

import React, { createContext, useContext } from "react";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { useGameState } from "@/hooks/use-game-state";

export interface GameProviderProps {
  children: React.ReactNode;
  initialColor: ChessColor;
  initialDifficulty: StockfishDifficulty;
  initialMode: StockfishMode;
  soundEnabled: boolean;
}

const GameContext = createContext<ReturnType<typeof useGameState> | null>(null);

export function GameProvider({
  children,
  initialColor,
  initialDifficulty,
  initialMode,
  soundEnabled
}: GameProviderProps) {
  // The entire game logic is now encapsulated in a custom hook
  const value = useGameState({
    initialColor,
    initialDifficulty,
    initialMode,
    soundEnabled
  });

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a <GameProvider>");
  }
  return context;
}
