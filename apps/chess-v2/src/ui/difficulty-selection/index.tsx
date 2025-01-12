"use client";
import { Brain } from "lucide-react";
import type { StockfishDifficulty } from "@/types/chess";
import { Button } from "@/ui/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/ui/atoms/dialog";
import { useGame } from "@/contexts/game-context";

interface DifficultySelectionProps {
  onSelectAction: (difficulty: StockfishDifficulty) => void;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  allowClose: boolean;
}

export default function DifficultySelection({
  onSelectAction,
  open,
  onOpenChangeAction,
  allowClose
}: DifficultySelectionProps) {
  const { difficulty } = useGame()
  const handleSelect = (selectedDifficulty: StockfishDifficulty) => {
    onSelectAction(selectedDifficulty)
  }

  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChangeAction : undefined}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white" aria-describedby="dialog-description">
        <p id="dialog-description" className="sr-only">Choose the difficulty level for your chess game</p>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Select Difficulty</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => handleSelect("beginner")}
              className={`w-full p-4 rounded-lg text-left transition ${
                difficulty === "beginner"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Beginner</h3>
                  <p className="text-gray-300">Perfect for learning chess</p>
                </div>
                <Brain className="w-6 h-6 text-yellow-400" />
              </div>
            </button>

            <button
              onClick={() => handleSelect("intermediate")}
              className={`w-full p-4 rounded-lg text-left transition ${
                difficulty === "intermediate"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Intermediate</h3>
                  <p className="text-gray-300">For experienced players</p>
                </div>
                <div className="flex gap-0.5">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <Brain className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelect("expert")}
              className={`w-full p-4 rounded-lg text-left transition ${
                difficulty === "expert"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Expert</h3>
                  <p className="text-gray-300">Challenge yourself</p>
                </div>
                <div className="flex gap-0.5">
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <Brain className="w-6 h-6 text-yellow-400" />
                  <Brain className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={() => onSelectAction(difficulty)}
            className="w-full h-14 text-xl font-bold bg-green-600 hover:bg-green-700"
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
