"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
import type { StockfishDifficulty } from "@/types/chess";
import { Button } from "@/ui/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/ui/atoms/dialog";

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
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<StockfishDifficulty>("intermediate");

  const handleSelect = () => {
    onSelectAction(selectedDifficulty);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={allowClose ? onOpenChangeAction : undefined}>
      <DialogContent
        className="bg-gray-900 text-white sm:max-w-md"
        aria-describedby="dialog-description">
        <p id="dialog-description" className="sr-only">
          Choose the difficulty level for your chess game
        </p>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Select Difficulty
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => setSelectedDifficulty("beginner")}
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedDifficulty === "beginner"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Beginner</h3>
                  <p className="text-gray-300">Perfect for learning chess</p>
                </div>
                <Brain className="h-6 w-6 text-yellow-400" />
              </div>
            </button>

            <button
              onClick={() => setSelectedDifficulty("intermediate")}
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedDifficulty === "intermediate"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Intermediate</h3>
                  <p className="text-gray-300">For experienced players</p>
                </div>
                <div className="flex gap-0.5">
                  <Brain className="h-6 w-6 text-yellow-400" />
                  <Brain className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDifficulty("expert")}
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedDifficulty === "expert"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Expert</h3>
                  <p className="text-gray-300">Challenge yourself</p>
                </div>
                <div className="flex gap-0.5">
                  <Brain className="h-6 w-6 text-yellow-400" />
                  <Brain className="h-6 w-6 text-yellow-400" />
                  <Brain className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={handleSelect}
            className="h-14 w-full bg-green-600 text-xl font-bold hover:bg-green-700">
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
