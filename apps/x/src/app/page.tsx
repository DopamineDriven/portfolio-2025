import { Suspense } from "react";
import Home from "@/ui/home";

export default function HomePage() {
  return (
    <Suspense fallback={"Loading..."}>
      <Home data={undefined} />
    </Suspense>
  );
}
