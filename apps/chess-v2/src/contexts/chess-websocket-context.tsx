"use client";

import React, { createContext, useContext } from "react";
import { Chess } from "chess.js";
import type { ChessApiMessage } from "@/utils/websocket";
import { useChessWebSocket } from "@/hooks/use-chess-websocket";

interface ChessWebSocketContextValue {
  lastMessage: ChessApiMessage | null; // or ChessApiMessage
  isConnected: boolean;
  sendPosition: (fen: string, variants?: number, depth?: number) => void;
  requestChessApiEvaluation: (game: InstanceType<typeof Chess>) => void;
  chessApiEvaluation: ChessApiMessage | null;
}

const ChessWebSocketContext = createContext<ChessWebSocketContextValue | null>(
  null
);

export function ChessWebSocketProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    lastMessage,
    isConnected,
    sendPosition,
    chessApiEvaluation,
    requestChessApiEvaluation
  } = useChessWebSocket();

  return (
    <ChessWebSocketContext.Provider
      value={{
        lastMessage,
        isConnected,
        sendPosition,
        requestChessApiEvaluation,
        chessApiEvaluation
      }}>
      {children}
    </ChessWebSocketContext.Provider>
  );
}

export function useChessWebSocketContext() {
  const context = useContext(ChessWebSocketContext);
  if (!context) {
    throw new Error(
      "useChessWebSocketContext must be used within ChessWebSocketProvider"
    );
  }
  return context;
}
