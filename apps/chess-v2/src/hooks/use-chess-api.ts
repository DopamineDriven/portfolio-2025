"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  //const [ws, setWs] = useState<WebSocket | null>(null); // removed in favor of ref
  const [lastMessage, setLastMessage] = useState<ChessApiMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageQueue = useRef<string[]>([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return; // Already connected
      }

      const socket = new WebSocket("wss://chess-api.com/v1");
      wsRef.current = socket; //Replaced setWs(socket) as per update 2

      socket.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        //setWs(socket); //Removed as per update 2

        // Process any queued messages
        while (messageQueue.current.length > 0) {
          const message = messageQueue.current.shift();
          if (message && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
          }
        }
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
      };

      socket.onerror = error => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      socket.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          const delay = 1000 * Math.pow(2, reconnectAttempts.current);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setIsConnected(false);
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendPosition = useCallback(
    (fen: string, variants = 1, depth = 12) => {
      const message = JSON.stringify({ fen, variants, depth });

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(message);
      } else {
        // Queue the message if not connected
        messageQueue.current.push(message);
        // If we're not already trying to connect, attempt to connect
        if (!wsRef.current) {
          connect();
        }
      }
    },
    [connect]
  );

  // Helper function to parse SAN notation into from/to squares
  const parseSanMove = (san: string) => {
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

  return { sendPosition, lastMessage, isConnected }; //Removed ws as per update 3
}


// export function useChessApi() {
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [lastMessage, setLastMessage] = useState<ChessApiMessage | null>(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const messageQueue = useRef<string[]>([]);
//   const reconnectAttempts = useRef(0);
//   const maxReconnectAttempts = 5;

//   const connect = useCallback(() => {
//     try {
//       const socket = new WebSocket('wss://chess-api.com/v1');

//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//         setIsConnected(true);
//         reconnectAttempts.current = 0;

//         // Process any queued messages
//         while (messageQueue.current.length > 0) {
//           const message = messageQueue.current.shift();
//           if (message) socket.send(message);
//         }
//       };

//       socket.onmessage = (event: MessageEvent<string>) => {
//         const message = JSON.parse(event.data) as ChessApiMessage;
//         if (message.type === 'bestmove' && message.san) {
//           const move = parseSanMove(message.san);
//           if (move) {
//             message.from = move.from;
//             message.to = move.to;
//           }
//         }
//         setLastMessage(message);
//       };

//       socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         setIsConnected(false);
//       };

//       socket.onclose = () => {
//         console.log('WebSocket connection closed');
//         setIsConnected(false);

//         // Attempt to reconnect if we haven't exceeded max attempts
//         if (reconnectAttempts.current < maxReconnectAttempts) {
//           reconnectAttempts.current += 1;
//           setTimeout(connect, 1000 * Math.pow(2, reconnectAttempts.current)); // Exponential backoff
//         }
//       };

//       setWs(socket);
//     } catch (error) {
//       console.error('Failed to create WebSocket:', error);
//       setIsConnected(false);
//     }
//   }, []);

//   useEffect(() => {
//     connect();
//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, [connect, ws]);

//   const sendPosition = useCallback((fen: string, variants = 1, depth = 12) => {
//     const message = JSON.stringify({ fen, variants, depth });

//     if (ws && isConnected) {
//       ws.send(message);
//     } else {
//       // Queue the message if not connected
//       messageQueue.current.push(message);
//       // If we're not already trying to connect, attempt to connect
//       if (!ws) {
//         connect();
//       }
//     }
//   }, [ws, isConnected, connect]);

//   // Helper function to parse SAN notation into from/to squares
//   const parseSanMove = (san: string) => {
//     const moveRegex = /([NBRQK])?([a-h][1-8])([x-])?([a-h][1-8])/;
//     const match = san.match(moveRegex);
//     if (match) {
//       return {
//         from: match[2],
//         to: match[4],
//       };
//     }
//     return null;
//   };

//   return { sendPosition, lastMessage, isConnected };
// }
