"use client";

import { useEffect } from "react";
import { useChessWebSocketContext } from "@/contexts/chess-websocket-context";
import { useGame } from "@/contexts/game-context";
import { useAdvantageTracker } from "@/hooks/use-advantage-tracker";
import { AdvantageChart } from "@/ui/advantage-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";

export function AnalyzeAdvantage() {
  const { game, moves } = useGame();
  const { chessApiEvaluation } = useChessWebSocketContext();
  const { advantageHistory, addAdvantagePoint, resetAdvantageHistory } =
    useAdvantageTracker();

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
    <div className="mx-auto sm:flex w-full sm:flex-row hidden">
      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Position Advantage</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvantageChart  data={advantageHistory} height={300} />
        </CardContent>
      </Card>
    </div>
  );
}
