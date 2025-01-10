"use client";
interface MessageData {
  type: string;
  payload: Record<string, any> | string;
}
export class Engine {
  private stockfish: Worker | null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined"
        ? new Worker("/stockfish/stockfish.js")
        : null;
    addEventListener("message", (event: MessageEvent<MessageData>) => {
      const { type, payload } = event.data;
if (this.stockfish) {
      switch (type) {
        case "INIT_ENGINE": {
          // Relay any messages from Stockfish to the main thread
          this.stockfish.onmessage = (event: MessageEvent<string>) => {
            const { data: line } = event;
            this.stockfish?.postMessage({ type: "ENGINE_OUTPUT", payload: line });
          };

          // Example initialization: set skill level (0-20 in Stockfish, but user range: 1-20)
          this.sendMessage(
            `setoption name Skill Level value ${typeof payload === "string" ? payload : payload.skillLevel}`
          );

          // Wait for further commands from main thread
          break;
        }

        case "SEND_COMMAND": {
          // Forwards a UCI command to the engine
          // e.g. "position startpos moves e2e4 e7e5" or "go depth 15"
          this.sendMessage(
            typeof payload === "string" ? payload : payload.command as string
          );
          break;
        }

        default:
          break;
      }
    }});
    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.stockfish) {
      this.stockfish.addEventListener("message", (e: MessageEvent<string>) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
        callback({ bestMove: bestMove ?? "" });
      });
    }
  }

  evaluatePosition(fen: string, depth: number) {
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }

  stop() {
    this.sendMessage("stop");
  }

  quit() {
    this.sendMessage("quit");
  }



  private sendMessage(message: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    }
  }
}
