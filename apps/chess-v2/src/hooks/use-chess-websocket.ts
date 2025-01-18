// useChessWebSocket.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChessApiMessage, ChessWebSocketClient } from "@/utils/websocket";
import { Chess } from "chess.js";

export function useChessWebSocket() {
  const [lastMessage, setLastMessage] = useState<ChessApiMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Memoize a single instance of the WebSocket client
  const chessClientRef = useRef<ChessWebSocketClient | null>(null);

  // Initialize once
  if (!chessClientRef.current) {
    chessClientRef.current = new ChessWebSocketClient("wss://chess-api.com/v1");
  }

 const [chessApiEvaluation, setChessApiEvaluation] =
useState<ChessApiMessage | null>(null);

    useEffect(() => {
      if (lastMessage && lastMessage.type === "bestmove") {
        setChessApiEvaluation(lastMessage);
      }
    }, [lastMessage]);

  useEffect(() => {
    const client = chessClientRef.current!;

    // Connect immediately
    client.connect();

    // Register listener
    const handleMessage = (data: ChessApiMessage) => {
      setLastMessage(data);
    };
    client.addMessageListener(handleMessage);

    // You can poll the connection status from the client if you store it in a property
    // or rely on onopen/onclose events to manage local state. For simplicity, let’s do it via events:
    const intervalId = setInterval(() => {
      // If you store isConnected in the class, you can do:
      setIsConnected(client["isConnected"]);
    }, 500);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      client.removeMessageListener(handleMessage);
      client.close(); // optional if you want a permanent connection
    };
  }, []);

  const sendPosition = useCallback((fen: string, variants = 1, depth = 12) => {
    chessClientRef.current?.sendPosition(fen, variants, depth);
  }, []);

  const requestChessApiEvaluation = useCallback((game: InstanceType<typeof Chess>) => {
    sendPosition(game.fen());
  }, [sendPosition]);

  return {
    lastMessage,
    isConnected,
    sendPosition,
    chessApiEvaluation,
    requestChessApiEvaluation
  };
}
