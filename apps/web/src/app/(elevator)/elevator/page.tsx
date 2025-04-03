import { Suspense } from "react";
import { Elevator } from "@/ui/elevator";

export default function ElevatorPage() {
  return (
    <Suspense>
      <Elevator />
    </Suspense>
  );
}
