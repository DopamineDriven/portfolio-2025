import { Suspense } from "react";
import { LandingPage } from "@/ui/landing";

export default function HomePage() {
  return (
    <Suspense fallback={"Loading..."}>
      <LandingPage />
    </Suspense>
  );
}
