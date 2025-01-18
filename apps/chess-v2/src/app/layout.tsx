import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChessWebSocketProvider } from "@/contexts/chess-websocket-context";
import { GameProvider } from "@/contexts/game-context";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  colorScheme: "normal",
  userScalable: true,
  themeColor: "#1f2937",
  viewportFit: "auto",
  initialScale: 1,
  width: "device-width"
} satisfies Viewport;



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
