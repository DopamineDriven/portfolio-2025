"use client";

import { useCallback, useState } from "react";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { useGame } from "@/contexts/game-context";
import { Button } from "@/ui/atoms/button";
import ChessboardBot from "@/ui/chessboard-bot";
import DifficultySelection from "@/ui/difficulty-selection";
import GameSettings from "@/ui/game-settings";
// import { AnalyzeAdvantage } from "../analyze-advantage";

export default function Home({ country = "US" }: { country?: string }) {
  const {
    setDifficulty,
    setPlayerColor,
    setMode,
    setIsSoundEnabled,
    playerColor
  } = useGame();

  const [showDifficultySelection, setShowDifficultySelection] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleDifficultySelect = useCallback(
    (newDifficulty: StockfishDifficulty) => {
      setDifficulty(newDifficulty);
      setShowDifficultySelection(false);
      setShowSettings(true);
    },
    [setDifficulty]
  );

  const handleGameStart = useCallback(
    (settings: {
      playerColor: ChessColor | "random";
      mode: StockfishMode;
      soundEnabled: boolean;
    }) => {
      setPlayerColor(
        settings.playerColor === "random"
          ? Math.random() < 0.5
            ? "white"
            : "black"
          : settings.playerColor
      );
      setMode(settings.mode);
      setIsSoundEnabled(settings.soundEnabled);
      setShowSettings(false);
      setGameStarted(true);
    },
    [setIsSoundEnabled, setPlayerColor, setMode]
  );

  const handleNewGame = useCallback(() => {
    setShowDifficultySelection(true);
    setGameStarted(false);
    setPlayerColor(playerColor);
  }, [playerColor, setPlayerColor]);
//         "flex min-h-screen flex-col gap-4 bg-gray-800 px-0 text-white sm:flex-row sm:gap-8 sm:px-6"

  return (
    <div
      className={
        "flex min-h-screen flex-col gap-4 bg-gray-800 px-0 text-white sm:flex-row sm:gap-8 sm:px-6"
      }>
      <div className="flex w-full flex-col items-center justify-center gap-2 sm:w-full">
        {gameStarted ? (
          <ChessboardBot country={country} onRestart={handleNewGame}>
            {/* <AnalyzeAdvantage /> */}
          </ChessboardBot>
        ) : (
          <div className="flex h-[80vw] w-[80vw] items-center justify-center rounded-lg bg-gray-700 sm:h-[400px] sm:w-[400px]">
            <p className="text-gray-400">Game Settings</p>
          </div>
        )}
        {!gameStarted && (
          <Button onClick={handleNewGame} className="mt-4">
            New Game
          </Button>
        )}
      </div>
      <DifficultySelection
        open={showDifficultySelection}
        onOpenChangeAction={setShowDifficultySelection}
        onSelectAction={handleDifficultySelect}
        allowClose={gameStarted}
      />
      <GameSettings
        open={showSettings}
        onOpenChangeAction={setShowSettings}
        onStartAction={handleGameStart}
        allowClose={gameStarted}
      />
    </div>
  );
}
