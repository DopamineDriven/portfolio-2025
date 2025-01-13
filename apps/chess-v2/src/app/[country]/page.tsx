import type { InferGSPRT } from "@/types/next";
import Home from "@/ui/home";
import { flags } from "@/utils/flags";

export async function generateStaticParams() {
  return flags.map(country => {
    return { country: country };
  });
}

export default async function ChessBot2025({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { country } = await params;
  if (!country) {
    return <Home country={"NO"} />;
  }
  return <Home country={country} />;
}
