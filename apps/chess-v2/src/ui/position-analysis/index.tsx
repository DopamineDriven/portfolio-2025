"use client";

import React from "react";
import type { ChessApiMessage } from "@/hooks/use-chess-api";

interface PositionAnalysisProps {
  evaluation: ChessApiMessage | null;
  isConnected: boolean;
  isLoading: boolean;
}

const PositionAnalysis: React.FC<PositionAnalysisProps> = ({
  evaluation,
  isConnected,
  isLoading
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Position Analysis:</h3>
      {isLoading ? (
        <p>Analyzing position...</p>
      ) : evaluation ? (
        <>
          <p>{evaluation.text}</p>
          {evaluation.continuationArr && (
            <div className="mt-2">
              <h4 className="font-semibold">Suggested continuation:</h4>
              <p>{evaluation.continuationArr.join(", ")}</p>
            </div>
          )}
        </>
      ) : (
        <p>
          {isConnected
            ? "Waiting for evaluation..."
            : "Connecting to analysis server..."}
        </p>
      )}
    </div>
  );
};

export default PositionAnalysis;
