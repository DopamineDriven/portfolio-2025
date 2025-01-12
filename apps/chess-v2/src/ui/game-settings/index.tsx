"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import type { StockfishMode } from "@/types/chess";
import type { ChessColor } from "@/utils/chess-types";
import { Button } from "@/ui/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/ui/atoms/dialog";
import { BlackKing, PlayAsRandom, WhiteKing } from "@/ui/chess-vectors";
import { useGame } from "@/contexts/game-context";

interface GameSettingsProps {
  onStartAction: (settings: { playerColor: ChessColor | "random", mode: StockfishMode }) => void
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  allowClose: boolean
}

export default function GameSettings({ onStartAction, open, onOpenChangeAction, allowClose }: GameSettingsProps) {
  const { playerColor, mode, setPlayerColor } = useGame()
  const [selectedColor, setSelectedColor] = useState<ChessColor | "random">(playerColor)
  const [selectedMode, setSelectedMode] = useState<StockfishMode>(mode)

  const handleStart = () => {
    onStartAction({
      playerColor: selectedColor,
      mode: selectedMode,
    })
  }



  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChangeAction : undefined}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white" aria-describedby="dialog-description">
        <p id="dialog-description" className="sr-only">Choose your chess game settings including player color and difficulty level</p>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Game Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">I play as:</h3>
            <div className="flex justify-center gap-4">
              <Button
                size="random"
                variant="outline"
                onClick={() => setSelectedColor("white")}
                className={`w-16 h-16 ${
                  selectedColor === "white" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                }`}
              >
                <WhiteKing className="w-12 h-12" />
              </Button>
              <Button
                size="random"
                variant="outline"
                onClick={() => setSelectedColor("random")}
                className={`w-16 h-16 ${
                  selectedColor === "random" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                }`}
              >
                <PlayAsRandom className="w-16 h-16 object-cover" />
              </Button>
              <Button
                size="random"
                variant="outline"
                onClick={() => setSelectedColor("black")}
                className={`w-16 h-16 ${
                  selectedColor === "black" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
                }`}
              >
                <BlackKing className="w-12 h-12" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedMode("challenge")}
              className={`w-full p-4 rounded-lg text-left transition ${
                selectedMode === "challenge"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Challenge</h3>
                  <p className="text-gray-300">No help of any kind</p>
                </div>
                <div className="flex gap-1">
                  <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                  <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                  <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode("friendly")}
              className={`w-full p-4 rounded-lg text-left transition ${
                selectedMode === "friendly"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Friendly</h3>
                  <p className="text-gray-300">Hints & takebacks allowed</p>
                </div>
                <div className="flex gap-1">
                  <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                  <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMode("assisted")}
              className={`w-full p-4 rounded-lg text-left transition ${
                selectedMode === "assisted"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Assisted</h3>
                  <p className="text-gray-300">All the tools available</p>
                </div>
                <div className="flex gap-1">
                  <Crown className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={handleStart}
            className="w-full h-14 text-xl font-bold bg-green-600 hover:bg-green-700"
          >
            Play
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
