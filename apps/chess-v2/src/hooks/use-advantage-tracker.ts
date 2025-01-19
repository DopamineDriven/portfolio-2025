"use client";

import { useCallback, useState } from "react";
import type { MoveAdvantage } from "@/types/advantage";
import { extractBracketed } from "@/utils/extract-bracketed";


export function useAdvantageTracker() {
  const [advantageHistory, setAdvantageHistory] = useState<MoveAdvantage[]>([]);

  const addAdvantagePoint = useCallback(
    (text: string, moveNumber: number, fen: string) => {
      const advantage = extractBracketed(text);

      if (advantage !== null) {

        setAdvantageHistory(prev => [
          ...prev,
          {
            moveNumber,
            advantage,
            fen
          }
        ]);
      }
    },
    []
  );

  const resetAdvantageHistory = useCallback(() => {
    setAdvantageHistory([]);
  }, []);

  return {
    advantageHistory,
    addAdvantagePoint,
    resetAdvantageHistory
  };
}
