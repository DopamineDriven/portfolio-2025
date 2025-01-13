import type { InferGSPRT } from "@/types/next";
import Home from "@/ui/home";
import { flagsArr } from "@/utils/country-flags";

export async function generateStaticParams() {
  return flagsArr.map(country => {
    return { country: country };
  });
}

export default async function ChessBot2025({
  params
}: InferGSPRT<typeof generateStaticParams>) {
  const { country } = await params;
  return <Home country={country} />;
}
