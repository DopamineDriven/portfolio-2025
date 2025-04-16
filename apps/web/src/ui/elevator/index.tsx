"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/ui/loading-spinner";

const ElevatorAnimationPage = dynamic(() => import("@/ui/elevator/r3f"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

export function ElevatorClientWrapper() {
  return <ElevatorAnimationPage />;
}
