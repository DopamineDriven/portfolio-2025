import { Suspense } from "react";
import { getUserData } from "@/lib/x-api";
import Home from "@/ui/home";

export default async function HomePage() {
  const data = await getUserData("@Dopamine_Driven");

  return (
    <Suspense fallback={"Loading..."}>
      <Home data={data} />
    </Suspense>
  );
}
