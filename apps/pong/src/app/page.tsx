import { cookies } from "next/headers";
import PongGame from "@/ui/pong-game";

export default async function Home() {
  const cookieStore = await cookies();

  const viewport = cookieStore.get("viewport")?.value ?? "";
  const ios = cookieStore.get("ios")?.value ?? "";

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="mb-6 text-4xl font-bold text-white">React Pong</h1>
      <PongGame viewport={viewport} ios={ios} />
    </main>
  );
}
