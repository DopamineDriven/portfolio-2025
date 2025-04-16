import type { Metadata } from "next";
import { ElevatorClientWrapper } from "@/ui/elevator";

export const metadata = {
  title: "Elevator Scene"
} satisfies Metadata;

export default function ElevatorExperiencePage() {
  return <ElevatorClientWrapper />;
}
