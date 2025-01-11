import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = {
  darkSquareStyle: React.CSSProperties;
  lightSquareStyle: React.CSSProperties;
};

type BoardStore = {
  theme: Theme;
  moves: string[];
  gameResult: string | null;
  currentFEN: string;
  userName: string;
  profilePhoto: string;
  gameOver: boolean;
  onNewGame: () => void;
  setTheme: (theme: Theme) => void;
  setMoves: (moves: string[]) => void;
  setGameResult: (result: string | null) => void;
  setOnNewGame: (onNewGame: () => void) => void;
  setCurrentFEN: (fen: string) => void;
  setUserName: (name: string) => void;
  setProfilePhoto: (photo: string) => void;
  setGameOver: (gameOver: boolean) => void;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    set => ({
      theme: {
        darkSquareStyle: { backgroundColor: "#779952" },
        lightSquareStyle: { backgroundColor: "#edeed1" }
      },
      moves: [],
      gameResult: null,
      currentFEN: "",
      userName: "User",
      profilePhoto: "/chess-default-2.png",
      gameOver: false,
      onNewGame: () => {},
      setTheme: theme => set({ theme }),
      setMoves: moves => set({ moves }),
      setGameResult: result => set({ gameResult: result }),
      setOnNewGame: onNewGame => set({ onNewGame }),
      setCurrentFEN: fen => set({ currentFEN: fen }),
      setUserName: name => set({ userName: name }),
      setProfilePhoto: photo => set({ profilePhoto: photo }),
      setGameOver: gameOver => set({ gameOver })
    }),
    { name: "Board Store" }
  )
);
