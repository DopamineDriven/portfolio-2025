"use client";

import { useCallback, useEffect, useState } from "react";

export interface ChessApiMessage {
  /**
   * Response types can be categorized as "move," "bestmove," or "info." Messages of type "move" are delivered progressively, indicating that the engine has identified a promising move at a given depth. The final message, denoted as "bestmove," represents the optimal move proposed among those identified. Additionally, "info" messages may include supplementary details such as status updates or error notifications.
   */
  type: "move" | "bestmove" | "info";
  /**
   * Position evaluation. Negative value means that black is winning.
   */
  eval: number;
  /**
   * The depth at which the move was discovered is significant, as higher depths typically correlate with greater accuracy. For context, a depth of 12 corresponds to approximately 2350 FIDE elo, akin to the level of International Masters like Eric Rosen or Levy Rozman. A depth of 18 equates to around 2750 FIDE elo, reflective of the skill level of Grandmaster Hikaru Nakamura. Furthermore, a depth of 20 corresponds to approximately 2850 FIDE elo, indicative of the caliber of Grandmaster Magnus Carlsen.
   */
  depth: number;
  /**
   * Textual description of data.
   *
   * text: 'Move b7 → b8 (b8=Q+): [-10.97]. Black is winning.'
   */
  text: string;
  /**
   * Winning chance: value 50 (50%) means that position is equal. Over 50 - white is winning. Below 50 - black is winning. This is calculated using Lichess formula (Win% = 50 + 50 * (2 / (1 + exp(-0.00368208 * centipawns)) - 1)). Values are similar to what evaluation bar shows on most of chess websites.
   */
  winChance: number;
  /**
   * Forced mate sequence detected (number shows how many moves have to be played to mate opponent's king). Negative numbers concern black pieces.
   */
  mate: number | null;
  /**
   * Short algebraic notation of move.
   */
  san: string;
  /**
   * Array of next moves to be played in suggested variant.
   */
  continuationArr: string[];
  /**
   * .from / .to / .fromNumeric / .toNumeric
   * Move coordinations on the board. Might be handy to easily highlight moves on the board, draw arrows etc.
   */
  from?: string;
  to?: string;
  fromNumeric?: string;
  toNumeric?: string;
  /**
   * Information about captured piece (if any). Letters stands for piece name (r - rook, n - knight, q - queen an so on)
   */
  captured?: string;
  /**
   * Current player's turn. Values: 'w' or 'b'.
   */
  turn: "w" | "b";
  /**
   * Piece type (r - rook, n - knight, q - queen an so on)
   */
  piece: "r" | "n" | "b" | "q" | "p" | "k";
  /**
   *  Task (calculation) identifier. This can be set by attaching "taskId" field in your message. May be used to pair responses with request. Generate with random function like Math.rand().
   */
  taskId: string;
  /**
   * If move is promotion, piece symbol will be here (r / n / b / q)
   */
  promotion: "r" | "n" | "b" | "q" | false;
  /**
   * True or false - whether move is castling.
   */
  isCastling: boolean;
  /**
   * Whether move is capture. True or false.
   */
  isCapture: boolean;
  /**
   * Contains one or more of the string values: n - a non-capture / b - a pawn push of two squares / e - an en passant capture / c - a standard capture / p - a promotion / k - kingside castling / q - queenside castling.
   */
  flags: string;
  continuation: {
    from: string;
    to: string;
    fromNumeric: string;
    toNumeric: string;
  }[];
}

export function useChessApi() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<ChessApiMessage | null>(null);
  // Helper function to parse SAN notation into from/to squares
  const parseSanMove = (san: string) => {
    // This is a simplified parser - you might need a more robust one
    const moveRegex = /([NBRQK])?([a-h][1-8])([x-])?([a-h][1-8])/;
    const match = san.match(moveRegex);
    if (match) {
      return {
        from: match[2],
        to: match[4]
      };
    }
    return null;
  };

  useEffect(() => {
    const socket = new WebSocket("wss://chess-api.com/v1");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as ChessApiMessage;
      if (message.type === "bestmove" && message.san) {
        const move = parseSanMove(message.san);
        if (move) {
          message.from = move.from;
          message.to = move.to;
        }
      }
      setLastMessage(message);
      console.log("Received message:", message);
    };

    socket.onerror = error => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendPosition = useCallback(
    (fen: string, variants = 1, depth = 12) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ fen, variants, depth }));
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [ws]
  );

  return { sendPosition, lastMessage };
}
