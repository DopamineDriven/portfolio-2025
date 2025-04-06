"use client";

import dynamic from "next/dynamic";
import { ElevatorLoading } from "./loading";

// Dynamic import with ssr: false is only allowed in Client Components
const ElevatorAnimationPage = dynamic(() => import("@/ui/elevator/animation"), {
  loading: () => <ElevatorLoading />, // We'll use the passed fallback instead
  ssr: false // Now this is valid since we're in a client component
});

export function ElevatorClientWrapper() {
  return <ElevatorAnimationPage />;
}
