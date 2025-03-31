"use client";

import type { TweetV2, UserV2 } from "twitter-api-v2";
import { GentleText } from "@d0paminedriven/motion";

export default function Home({
  data
}: {
  data?: {
    profile: UserV2;
    tweets: TweetV2[];
  };
}) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-900 p-4">
      <GentleText
        content="X Integration App"
        textClassName="text-4xl font-bold text-white mb-6"
        maxWidth="fit"
        containerClassName="mx-auto"
        animateOnlyInView={true}
        autoPlay
        animationOptions={{ repeatType: "loop" }}
        as="h1"
        animateTarget="chars"
      />
      <div className="my-5">
        {data ? (
          <pre className="font-basis-grotesque-pro-regular mx-auto w-full text-sm">
            {" "}
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <pre className="font-basis-grotesque-pro-regular mx-auto my-5 w-full text-sm">
            No data
          </pre>
        )}
      </div>
    </main>
  );
}
