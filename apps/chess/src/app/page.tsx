import ChessGame from "@/ui/chess/chess-game";

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-between px-24">
      <ChessGame />
    </main>
  );
}
