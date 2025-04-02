"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { Transition } from "@/ui/transition";

export default function Template({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[100dvh] max-w-[96rem] flex-col overflow-x-hidden! sm:px-6 lg:px-8">
          <div className="h-16 w-full animate-pulse bg-background dark:bg-background" />{" "}
          {/* Navbar placeholder */}
          <div className="bg-background flex-grow" />{" "}
          {/* Content placeholder */}
          <div className="h-32 w-full animate-pulse bg-background dark:bg-background" />{" "}
          {/* Footer placeholder */}
        </div>
      }>
      <Transition>{children}</Transition>
    </Suspense>
  );
}
