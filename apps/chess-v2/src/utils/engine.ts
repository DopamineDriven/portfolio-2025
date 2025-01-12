"use client";

export class Engine {
  private stockfish: Worker | null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
    this.onMessage = this.onMessage.bind(this);

    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.stockfish) {
      this.stockfish.addEventListener("message", (e: MessageEvent<string>) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];
        console.log(`[evaluating-best move]: ${bestMove}`)
        callback({ bestMove: bestMove ?? "" });
      });
    }
  }

  evaluatePosition(fen: string, depth: number) {
    console.log(`[evaluating-position]: \nfen:${fen} \ndepth:${depth}`)
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
