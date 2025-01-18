import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChessWebSocketProvider } from "@/contexts/chess-websocket-context";
import { GameProvider } from "@/contexts/game-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chess vs Stockfish",
  description: "Play chess against the Stockfish engine"
} satisfies Metadata;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <ChessWebSocketProvider>
          <GameProvider
            initialColor="white"
            initialDifficulty="beginner"
            initialMode="friendly"
            soundEnabled={true}>
            {children}
          </GameProvider>
        </ChessWebSocketProvider>
      </body>
    </html>
  );
}
