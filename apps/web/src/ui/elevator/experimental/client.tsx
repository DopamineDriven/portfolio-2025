"use client";

import dynamic from "next/dynamic";
import UseAnimationFrame from "@/ui/loading";

const ExperimentalElevator = dynamic(
  () => import("@/ui/elevator/experimental/index"),
  {
    loading: () => <UseAnimationFrame />,
    ssr: false
  }
);

export default function ExperimentalElevatorWrapper() {
  return <ExperimentalElevator />;
}
