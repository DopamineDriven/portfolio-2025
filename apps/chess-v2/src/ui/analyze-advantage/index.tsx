"use client";

import { useEffect } from "react";
import { useChessWebSocketContext } from "@/contexts/chess-websocket-context";
import { useGame } from "@/contexts/game-context";
import { useAdvantageTracker } from "@/hooks/use-advantage-tracker";
import { AdvantageChart } from "@/ui/advantage-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";

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
    <div className="mx-auto hidden w-full sm:flex sm:flex-row">
      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Position Advantage</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvantageChart data={advantageHistory} height={300} />
        </CardContent>
      </Card>
    </div>
  );
}
