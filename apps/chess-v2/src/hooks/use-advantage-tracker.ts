"use client";

import { useCallback, useState } from "react";
import type { MoveAdvantage } from "@/types/advantage";
import { extractBracketed } from "@/utils/extract-bracketed";

export function useAdvantageTracker(isNavigatingHistory: boolean) {
  const [advantageHistory, setAdvantageHistory] = useState<MoveAdvantage[]>([]);

  const addAdvantagePoint = useCallback(
    (text: string, moveNumber: number, fen: string) => {
      const advantage = extractBracketed(text);

      if (advantage === null) return;
      if (isNavigatingHistory === true) return;
      setAdvantageHistory(prev => {
        const idx = prev.findIndex(entry => entry.moveNumber === moveNumber);
        // create a new entry
        const newEntry = {
          moveNumber,
          advantage,
          fen
        } satisfies MoveAdvantage;
        // if we already have that moveNumber, replace it
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = newEntry;
          return updated;
        }
        // else add a new entry
        return [...prev, newEntry];
      });
    },
    [isNavigatingHistory]
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
