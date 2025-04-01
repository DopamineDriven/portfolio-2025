import PongGame from "@/ui/pong-game";

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="mb-6 text-4xl font-bold text-white">React Pong</h1>
      <PongGame />
    </main>
  );
}
