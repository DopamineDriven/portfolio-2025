"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/ui/loading-spinner";

const ExperimentalElevator = dynamic(
  () => import("@/ui/elevator/experimental/index"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export default function ExperimentalElevatorWrapper() {
  return <ExperimentalElevator />;
}
