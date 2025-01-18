// ChessWebSocketClient.ts
export interface ChessApiMessage {
  type: "move" | "bestmove" | "info";
  eval: number;
  depth: number;
  text: string;
  winChance: number;
  mate: number | null;
  san: string;
  continuationArr: string[];
  from?: string;
  to?: string;
  fromNumeric?: string;
  toNumeric?: string;
  captured?: string;
  turn: "w" | "b";
  piece: "r" | "n" | "b" | "q" | "p" | "k";
  taskId: string;
  promotion: "r" | "n" | "b" | "q" | false;
  isCastling: boolean;
  isCapture: boolean;
  flags: string;
  continuation: {
    from: string;
    to: string;
    fromNumeric: string;
    toNumeric: string;
  }[];
}

type Listener = (data: ChessApiMessage) => void;

/**
 * Encapsulates the connection to the Chess API over WebSocket.
 */
export class ChessWebSocketClient {
  private socket: WebSocket | null = null;
  private readonly url: string;
  private isConnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private messageQueue = Array.of<string>();

  // Listeners to broadcast the latest message to
  private listeners= Array.of<Listener>();

  constructor(url: string) {
    this.url = url;
    isConnected = false;
  }

  public connect() {
    // If already open or in the process of opening, just return
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    // Create the WebSocket
    this.socket = new WebSocket(this.url);

    // Set up event listeners
    this.socket.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Process any queued messages
      while (this.messageQueue.length > 0 && this.socket?.readyState === WebSocket.OPEN) {
        const msg = this.messageQueue.shift();
        if (msg) {
          this.socket.send(msg);
        }
      }
    };

    this.socket.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as ChessApiMessage;

      // Example SAN parse if needed
      if (data.type === "bestmove" && data.san) {
        const move = this.parseSanMove(data.san);
        if (move) {
          data.from = move.from;
          data.to = move.to;
        }
      }

      // Broadcast to listeners
      this.listeners.forEach((listener) => listener(data));
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.isConnected = false;
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      this.socket = null;

      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts += 1;
        const delay = 1000 * Math.pow(2, this.reconnectAttempts);
        this.reconnectTimeout = setTimeout(() => this.connect(), delay);
      } else {
        console.error("Max reconnect attempts reached");
      }
    };
  }

  /**
   * Sends a FEN position to the server (with optional variants / depth).
   */
  public sendPosition(fen: string, variants = 1, depth = 12) {
    const message = JSON.stringify({ fen, variants, depth });

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      // Queue messages if not connected
      this.messageQueue.push(message);
      // Force a connect attempt if needed
      if (!this.socket) {
        this.connect();
      }
    }
  }

  /**
   * Attach a listener to handle inbound ChessApiMessage data.
   */
  public addMessageListener(listener: Listener) {
    this.listeners.push(listener);
  }

  /**
   * Remove a previously registered listener.
   */
  public removeMessageListener(listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  /**
   * Close the connection and cleanup
   */
  public close() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private parseSanMove(san: string) {
    const moveRegex = /([NBRQK])?([a-h][1-8])([x-])?([a-h][1-8])/;
    const match = san.match(moveRegex);
    if (match) {
      return {
        from: match[2],
        to: match[4],
      };
    }
    return null;
  }
}
