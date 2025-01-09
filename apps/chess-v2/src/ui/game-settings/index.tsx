"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { Button } from "@/ui/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/ui/atoms/dialog";
import { BlackKing, PlayAsRandom, WhiteKing } from "@/ui/chess-vectors";
import { Color } from "chessground/types";

export interface GameSettingsProps {
  onStartAction: (settings: UserGameSettingsLocal) => void;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  allowClose: boolean;
}

export interface UserGameSettingsLocal {
  playerColor: Color | "random"
  difficulty: "challenge" | "friendly" | "assisted"
}

export default function GameSettings({
  onStartAction: onStart,
  open,
  onOpenChangeAction: onOpenChange,
  allowClose
}: GameSettingsProps) {
  const [selectedColor, setSelectedColor] = useState<UserGameSettingsLocal['playerColor']>("white");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<UserGameSettingsLocal["difficulty"]>("challenge");

  const handleStart = () => {
    onStart({
      playerColor: selectedColor,
      difficulty: selectedDifficulty
    });
  };

  return (
    <Dialog open={open} onOpenChange={allowClose ? onOpenChange : undefined}>
      <DialogContent
        className="bg-gray-900 text-white sm:max-w-md"
        aria-describedby="dialog-description">
        <p id="dialog-description" className="sr-only">
          Choose your chess game settings including player color and difficulty
          level
        </p>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Game Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-lg font-semibold">Play as:</h3>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedColor("white")}
                className={`h-16 w-16 ${
                  selectedColor === "white"
                    ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                    : ""
                }`}>
                <WhiteKing className="h-12 w-12" />
              </Button>
              <Button
                       size="random"
                variant="outline"
                onClick={() => setSelectedColor("random")}
                className={`h-16 w-16 ${
                  selectedColor === "random"
                    ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                    : ""
                }`}>
                <PlayAsRandom
                  className="h-16 w-16 object-cover"

                />
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedColor("black")}
                className={`h-16 w-16 ${
                  selectedColor === "black"
                    ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900"
                    : ""
                }`}>
                <BlackKing className="h-12 w-12" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedDifficulty("challenge")}
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedDifficulty === "challenge"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Challenge</h3>
                  <p className="text-gray-300">No help of any kind</p>
                </div>
                <div className="flex gap-1">
                  <Crown className="h-6 w-6 fill-current text-yellow-400" />
                  <Crown className="h-6 w-6 fill-current text-yellow-400" />
                  <Crown className="h-6 w-6 fill-current text-yellow-400" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDifficulty("friendly")}
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedDifficulty === "friendly"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Friendly</h3>
                  <p className="text-gray-300">Hints & takebacks allowed</p>
                </div>
                <div className="flex gap-1">
                  <Crown className="h-6 w-6 fill-current text-yellow-400" />
                  <Crown className="h-6 w-6 fill-current text-yellow-400" />
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDifficulty("assisted")}
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedDifficulty === "assisted"
                  ? "bg-green-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Assisted</h3>
                  <p className="text-gray-300">All the tools available</p>
                </div>
                <div className="flex gap-1">
                  <Crown className="h-6 w-6 fill-current text-yellow-400" />
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={handleStart}
            className="h-14 w-full bg-green-600 text-xl font-bold hover:bg-green-700">
            Play
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
