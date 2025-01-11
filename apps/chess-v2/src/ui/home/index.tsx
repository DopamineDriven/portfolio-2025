"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { StockfishDifficulty } from "@/types/chess";
import type { GameSettingsEntity as GameSettingsType } from "@/ui/game-settings";
import type { ChessColor } from "@/utils/chess-types";
import { Button } from "@/ui/atoms/button";
import ChessboardBot from "@/ui/chessboard-bot";
import DifficultySelection from "@/ui/difficulty-selection";
import GameSettings from "@/ui/game-settings";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDifficulty =
    (searchParams.get("difficulty") as StockfishDifficulty) || "intermediate";
  const _initialColor =
    (searchParams.get("color") as ChessColor | "random") || "white";

  const [messages, setMessages] = useState<
    { username: string; content: string }[]
  >([]);
  const [showDifficultySelection, setShowDifficultySelection] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettingsType | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<StockfishDifficulty>(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      setMessages(prevMessages => [
        ...prevMessages,
        { username: "User", content: message }
      ]);
    }
  };

  const handleDifficultySelect = (difficulty: StockfishDifficulty) => {
    setSelectedDifficulty(difficulty);
    router.push(`?difficulty=${difficulty}`, { scroll: false });
    setShowDifficultySelection(false);
    setShowSettings(true);
  };

  const handleGameStart = (settings: GameSettingsType) => {
    setGameSettings(settings);
    router.push(
      `?difficulty=${selectedDifficulty}&color=${settings.playerColor}&mode=${settings.mode}`,
      { scroll: false }
    );
    setShowSettings(false);
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setShowDifficultySelection(true);
    setGameSettings(null);
    setGameStarted(false);
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gray-800 px-4 py-2 text-white sm:flex-row sm:gap-8 sm:px-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="mb-4 text-2xl font-bold">Chess vs Stockfish</h1>
        {gameSettings ? (
          <ChessboardBot
            initialSettings={gameSettings}
            difficulty={selectedDifficulty}
            onRestart={handleNewGame}
          />
        ) : (
          <div className="flex h-[400px] w-[400px] items-center justify-center rounded-lg bg-gray-700">
            <p className="text-gray-400">
              Select game settings to start playing
            </p>
          </div>
        )}
        {!gameSettings && gameStarted && (
          <Button onClick={handleNewGame} className="mt-4">
            New Game
          </Button>
        )}
      </div>
      <div className="w-full sm:w-1/3">
        <div className="rounded-lg bg-gray-700 p-4">
          <h2 className="mb-2 text-xl font-bold">Chat</h2>
          <div className="mb-4 h-48 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.username}: </span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem(
                "message"
              ) as HTMLInputElement;
              handleSendMessage(input.value);
              input.value = "";
            }}>
            <input
              type="text"
              name="message"
              className="w-full rounded bg-gray-600 px-3 py-2 text-white"
              placeholder="Type a message..."
            />
          </form>
        </div>
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
