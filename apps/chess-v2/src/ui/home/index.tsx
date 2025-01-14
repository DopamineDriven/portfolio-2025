"use client";

import { useCallback, useState } from "react";
import type { StockfishDifficulty, StockfishMode } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { GameProvider } from "@/contexts/game-context";
import { Button } from "@/ui/atoms/button";
import ChatWidget from "@/ui/chat-widget";
import ChessboardBot from "@/ui/chessboard-bot";
import DifficultySelection from "@/ui/difficulty-selection";
import GameSettings from "@/ui/game-settings";

export default function Home({ country = "US" }: { country?: string }) {
  const [messages, setMessages] = useState<
    { username: string; content: string }[]
  >([]);
  const [showDifficultySelection, setShowDifficultySelection] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] =
    useState<StockfishDifficulty>("intermediate");
  const [playerColor, setPlayerColor] = useState<ChessColor>("white");
  const [mode, setMode] = useState<StockfishMode>("friendly");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      setMessages(prevMessages => [
        ...prevMessages,
        { username: "User", content: message }
      ]);
    }
  };

  const handleDifficultySelect = useCallback(
    (newDifficulty: StockfishDifficulty) => {
      setDifficulty(newDifficulty);
      setShowDifficultySelection(false);
      setShowSettings(true);
    },
    []
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
      setSoundEnabled(settings.soundEnabled);
      setShowSettings(false);
      setGameStarted(true);
    },
    []
  );

  const handleNewGame = useCallback(() => {
    setShowDifficultySelection(true);
    setGameStarted(false);
  }, []);

  return (
    <GameProvider
      initialColor={playerColor}
      initialDifficulty={difficulty}
      soundEnabled={soundEnabled}
      initialMode={mode}>
      <div
        className={
          "flex min-h-screen flex-col gap-4 bg-gray-800 px-0 py-2 text-white sm:items-center sm:justify-center"
        }>
        <div className="flex w-full flex-col items-center justify-center gap-2 sm:w-auto">
          {gameStarted ? (
            <ChessboardBot country={country} onRestart={handleNewGame} />
          ) : (
            <div className="flex h-[80vw] w-[80vw] items-center justify-center rounded-lg bg-gray-700 sm:h-[400px] sm:w-[400px]">
              <p className="text-gray-400">
                Select game settings to start playing
              </p>
            </div>
          )}
          {!gameStarted && (
            <Button onClick={handleNewGame} className="mt-4">
              New Game
            </Button>
          )}
        </div>
        <ChatWidget
          messages={messages}
          onSendMessageAction={handleSendMessage}
        />
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
    </GameProvider>
  );
}
