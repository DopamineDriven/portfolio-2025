"use client";

import React from "react";
import type { ChessApiMessage } from "@/hooks/use-chess-api";
import { cn } from "@/lib/utils";

interface PositionAnalysisProps {
  isMobile: boolean;
  evaluation: ChessApiMessage | null;
  isConnected: boolean;
  isLoading: boolean;
}

const PositionAnalysis: React.FC<PositionAnalysisProps> = ({ evaluation, isConnected, isLoading, isMobile }) => {
  return (
    <div className={cn(
      "space-y-2",
      isMobile && "max-h-[15dvh] sm:max-h-[20dvh] overflow-y-scroll pb-safe"
    )}>
      <h3 className="text-base font-sans sm:text-lg font-medium">Position Analysis:</h3>
      {isLoading ? (
        <p>Analyzing position...</p>
      ) : evaluation ? (
        <>
          <p>{evaluation.text}</p>
          {!isMobile && evaluation.continuationArr && (
            <div className="mt-2">
              <h4 className="font-semibold">Suggested continuation:</h4>
              <p>{evaluation.continuationArr.join(', ')}</p>
            </div>
          )}
        </>
      ) : (
        <p>{isConnected ? "Waiting for evaluation..." : "Connecting to analysis server..."}</p>
      )}
    </div>
  );
};

export default PositionAnalysis;
