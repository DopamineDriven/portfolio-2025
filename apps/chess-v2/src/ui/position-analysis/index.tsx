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
      "space-y-1 sm:space-y-2",
      isMobile && "max-h-[10dvh] sm:max-h-[20dvh] overflow-y-scroll pb-safe"
    )}>
      {isLoading ? (
        <p className="text-sm">Analyzing position...</p>
      ) : evaluation ? (
        <>
          <p className="text-pretty">{evaluation.text}</p>
          {!isMobile && evaluation.continuationArr && (
            <div className="mt-1 sm:mt-2">
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
