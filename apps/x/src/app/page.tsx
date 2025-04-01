import { Suspense } from "react";
import Home from "@/ui/home";

export default function HomePage() {
  // const data = await getUserData("@Dopamine_Driven");

  return (
    <Suspense fallback={"Loading..."}>
      <Home data={undefined} />
    </Suspense>
  );
}
