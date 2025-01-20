"use client";

import { useEffect } from "react";
import { useChessWebSocketContext } from "@/contexts/chess-websocket-context";
import { useGame } from "@/contexts/game-context";
import { useAdvantageTracker } from "@/hooks/use-advantage-tracker";
import { MoveAdvantage } from "@/types/advantage";
import { AdvantageChartTwo as AdvantageChart } from "@/ui/advantage-chart/temp";

function pairMovesAndAverage(raw: MoveAdvantage[]) {
  const result = [];
  for (let i = 0; i < raw.length; i += 2) {
    // White entry
    const w = raw[i]! as MoveAdvantage;
    // Black entry is the next array item
    const b = raw[i + 1]! as MoveAdvantage;
    if (!b) break; // if we have an odd length, skip the last unpaired entry

    // Average White's and Black's advantage
    const avgAdv = (w.advantage + b.advantage) / 2;

    // For the x-axis, you can use whichever moveNumber you prefer.
    // Many folks label the *pair* by White's move number (w.moveNumber) or (i/2 + 1).
    // Or you could do (w.moveNumber + b.moveNumber)/2 if you want a midpoint.
    const combinedMoveNumber = w.moveNumber === 1 ? 1 : Math.floor(w.moveNumber/2);
    // or: = Math.floor((w.moveNumber + b.moveNumber) / 2)

    result.push({
      moveNumber: combinedMoveNumber,
      advantage: avgAdv
    });
  }
  return result;
}

export function AnalyzeAdvantage() {
  const { game, moves, isNavigatingHistory } = useGame();
  const { chessApiEvaluation } = useChessWebSocketContext();
  const { advantageHistory, addAdvantagePoint, resetAdvantageHistory } =
    useAdvantageTracker(isNavigatingHistory);

  useEffect(() => {
    if (chessApiEvaluation?.text) {
      addAdvantagePoint(chessApiEvaluation.text, moves.length, game.fen());
    }
  }, [chessApiEvaluation, moves.length, game, addAdvantagePoint]);

  // Reset advantage history when starting a new game
  useEffect(() => {
    if (moves.length === 0 && !isNavigatingHistory) {
      resetAdvantageHistory();
    }
  }, [moves.length, resetAdvantageHistory, isNavigatingHistory]);
  // flex w-full flex-row items-center
  return (
    <div className="mx-auto hidden h-fit w-full sm:flex sm:flex-row">
      <AdvantageChart
        data={pairMovesAndAverage(advantageHistory)}
        height={350}
      />
    </div>
  );
}
