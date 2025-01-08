import ChessGame from "@/ui/chess/chess-game";

export default function Home() {
  return (
    <main className="lg:px-18 flex min-h-screen flex-col items-center justify-between px-12">
      <ChessGame />
    </main>
  );
}
