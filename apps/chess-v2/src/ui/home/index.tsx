"use client"

import { useState } from "react"
import ChessboardBot from "@/ui/chessboard-bot"
import GameSettings, { GameSettingsProps as GameSettingsType } from "@/ui/game-settings"
import DifficultySelection from "@/ui/difficulty-selection"
import type { StockfishDifficulty, DifficultyOptions } from "@/types/chess"
import { Button } from "@/ui/atoms/button"

export default function Home() {
  const [messages, setMessages] = useState<{ username: string; content: string }[]>([])
  const [showDifficultySelection, setShowDifficultySelection] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [gameSettings, setGameSettings] = useState<GameSettingsType | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<StockfishDifficulty>("intermediate")
  const [gameStarted, setGameStarted] = useState(false)

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      setMessages(prevMessages => [...prevMessages, { username: "User", content: message }])
    }
  }

  const handleDifficultySelect = (difficulty: StockfishDifficulty) => {
    setSelectedDifficulty(difficulty)
    setShowDifficultySelection(false)
    setShowSettings(true)
  }

  const handleGameStart = (settings: GameSettingsType) => {
    setGameSettings({
      ...settings,
      difficulty: selectedDifficulty
    })
    setShowSettings(false)
    setGameStarted(true)
  }

  const handleNewGame = () => {
    setShowDifficultySelection(true)
    setGameSettings(null)
    setGameStarted(false)
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex sm:flex-row flex-col sm:gap-8 gap-4 sm:px-6 px-4 py-2">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold mb-4">Chess vs Stockfish</h1>
        {gameSettings ? (
          <ChessboardBot
            initialSettings={gameSettings}
            onRestart={handleNewGame}
          />
        ) : (
          <div className="h-[400px] w-[400px] bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Select game settings to start playing</p>
          </div>
        )}
        {!gameSettings && gameStarted && (
          <Button onClick={handleNewGame} className="mt-4">
            New Game
          </Button>
        )}
      </div>
      <div className="w-full sm:w-1/3">
        <div className="bg-gray-700 rounded-lg p-4 h-full">
          <h2 className="text-xl font-bold mb-2">Chat</h2>
          <div className="h-64 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.username}: </span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={e => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement
              handleSendMessage(input.value)
              input.value = ""
            }}
          >
            <input
              type="text"
              name="message"
              className="w-full bg-gray-600 text-white px-3 py-2 rounded"
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
  )
}

