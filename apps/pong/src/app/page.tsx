import PongGame from "@/ui/pong-game"

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-6">React Pong</h1>
      <PongGame />
    </main>
  )
}

