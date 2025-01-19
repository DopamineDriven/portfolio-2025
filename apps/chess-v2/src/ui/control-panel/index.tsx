"use client";

import { useGame } from "@/contexts/game-context";

export default function ControlPanel() {
  const { game } = useGame();

  return (
    <div className="min-w-[200px] rounded-lg bg-blue-600 p-4 text-white shadow-md">
      <h2 className="mb-4 text-xl font-bold">Game Info</h2>
      <div className="space-y-2">
        <p>Turn: {game.turn() === "w" ? "White" : "Black"}</p>
        <p>Fullmoves: {game.moveNumber()}</p>
        <p>In check: {game.inCheck() ? "Yes" : "No"}</p>
        <p>Game over: {game.isGameOver() ? "Yes" : "No"}</p>
        {game.isGameOver() && (
          <p>
            Result:{" "}
            {game.isCheckmate()
              ? "Checkmate"
              : game.isDraw()
                ? "Draw"
                : game.isStalemate() ||
                    game.isThreefoldRepetition() ||
                    game.isInsufficientMaterial()
                  ? "Stalemate"
                  : "Unknown"}
          </p>
        )}
      </div>
    </div>
  );
}
