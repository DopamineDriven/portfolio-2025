"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { Transition } from "@/ui/transition";

export default function Template({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense>
      <Transition>{children}</Transition>
    </Suspense>
  );
}
