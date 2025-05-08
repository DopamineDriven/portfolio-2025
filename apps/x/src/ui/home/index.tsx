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
        content="X Integration App is really really really really long"
        textClassName="text-4xl font-bold mb-6"
        maxWidth="fit"
        containerClassName="mx-auto"
        animateOnlyInView={true}
        autoPlay
        allowOverflow
        yOffset={10}
        keyframes={{cy: [-15,15],
          opacity: [0, 1],dy: [-15,15],
          y: [-15, 15],
          scale: [0.25, 1],
          rotate: [-10, 0],
          color: ["#f8fafc", "#83e6f7"],
          filter: ["blur(4px)", "blur(0px)"]
        }}
        withStagger={{
          duration: 0.06,
          from: 0,
          startDelay: 1.1
        }}
        animationOptions={{
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
        as="address"
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
