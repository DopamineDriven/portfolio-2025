"use client";

import { GentleText } from "@d0paminedriven/motion";

export default function Home() {
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
    </main>
  );
}
