import type { FC } from "react";
import { Brain } from "lucide-react";
import type { StockfishDifficulty } from "@/types/chess";

export const DifficultyWorkup: FC<{
  handleSelect: (selectedDifficulty: StockfishDifficulty) => void;
  difficulty: StockfishDifficulty;
}> = ({ handleSelect, difficulty }) => {
  const description = {
    beginner: "Perfect for learning chess",
    intermediate: "For experienced players",
    expert: "For those looking for a challenge"
  } as const;
  return (
    <button
      onClick={() => handleSelect(difficulty)}
      className={`w-full rounded-lg bg-gray-800 p-4 text-left transition hover:bg-gray-700 focus:bg-green-600 focus:hover:bg-green-600`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            {difficulty
              .substring(0, 1)
              .toUpperCase()
              .concat(difficulty.substring(1))}
          </h3>
          <p className="text-gray-300">{description[difficulty]}</p>
        </div>

        {difficulty === "beginner" ? (
          <div className="flex gap-0.5">
            <Brain className="h-6 w-6 text-yellow-400" />
          </div>
        ) : difficulty === "intermediate" ? (
          <div className="flex gap-0.5">
            <Brain className="h-6 w-6 text-yellow-400" />
            <Brain className="h-6 w-6 text-yellow-400" />
          </div>
        ) : (
          <div className="flex gap-0.5">
            <Brain className="h-6 w-6 text-yellow-400" />
            <Brain className="h-6 w-6 text-yellow-400" />
            <Brain className="h-6 w-6 text-yellow-400" />
          </div>
        )}
      </div>
    </button>
  );
};
