export class Engine {
  private stockfish: Worker | null;

  constructor() {
    this.stockfish =
      typeof Worker !== "undefined" ? new Worker("/stockfish.js") : null;
    // this.onMessage = this.onMessage.bind(this);

    if (this.stockfish) {
      this.sendMessage("uci");
      this.sendMessage("isready");
    }
  }

  public onMessage(callback: (data: { bestMove: string }) => void) {
    if (this.stockfish) {
      this.stockfish.onmessage = (e: MessageEvent<string>) => {
        const d = e.data;
        const bestMove = d?.match(/bestmove\s+(\S+)/)?.[1];
        callback({ bestMove: bestMove ?? "" });
      };
    }
  }

  // "go infinite"
  public evaluatePositionInfinite(
    fen: string,
    difficulty: number,
    elo: number
  ) {
    // "position fen <fen>" gives Stockfish context on the current board configuration/position
    this.sendMessage(`position fen ${fen}`);
    this.sendMessage(`setoption name UCI_LimitStrength value true`);
    this.sendMessage(`setoption name UCI_Elo value ${elo}`);
    // set difficulty 0-20
    this.sendMessage(`setoption name Skill Level value ${difficulty}`);
    // let Stockfish search for best move endlessly until "stop" command is sent

    this.sendMessage("go infinite");
  }

  // "go movetime"
  public evaluatePositionMovetime(
    fen: string,
    elo: number,
    difficulty: number,
    movetime: number
  ) {
    // "position fen <fen>" gives Stockfish context on the current board configuration/position
    this.sendMessage(`position fen ${fen}`);
    this.sendMessage(`setoption name UCI_LimitStrength value true`);
    this.sendMessage(`setoption name UCI_Elo value ${elo}`);
    // set difficulty 0-20
    this.sendMessage(`setoption name Skill Level value ${difficulty}`);

    this.sendMessage(`go movetime ${movetime}`);
  }

  public skillLevel(difficulty: number) {
    // set difficulty 0-20
    this.sendMessage(`setoption name Skill Level value ${difficulty}`);
  }

  public evaluatePosition(fen: string, depth: number) {
    if (this.stockfish) {
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage(`go depth ${depth}`);
    }
  }
  public newGame() {
    this.sendMessage("ucinewgame");
  }

  public stop() {
    this.sendMessage("stop");
  }

  public quit() {
    this.sendMessage("quit");
  }

  public sendMessage(message: string) {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    }
  }
}
