"use client";

import { useEffect } from "react";
import { useChessWebSocketContext } from "@/contexts/chess-websocket-context";
import { useGame } from "@/contexts/game-context";
import { useAdvantageTracker } from "@/hooks/use-advantage-tracker";
import { AdvantageChartVertical } from "@/ui/advantage-chart-vertical";

export function AnalyzeAdvantageVertical() {
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
    if (moves.length === 0) {
      resetAdvantageHistory();
    }
  }, [moves.length, resetAdvantageHistory]);
  // flex w-full flex-row items-center
  return (
    <AdvantageChartVertical
      advantage={
        advantageHistory.length > 0
          ? (advantageHistory.pop()?.advantage ?? 0)
          : 0
      }
    />
  );
}
