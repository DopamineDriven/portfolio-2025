import ChessGame from "@/ui/chess/chess-game";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ChessGame />
    </main>
  );
}
