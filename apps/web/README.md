### Portfolio 2025

```tsx
"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { PageTransition as Transition } from "@/ui/transition";

export default function Template({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[100dvh] max-w-[96rem] flex-col overflow-x-hidden! sm:px-6 lg:px-8">
          <div className="bg-background dark:bg-background h-16 w-full animate-pulse" />{" "}
          {/* Navbar placeholder */}
          <div className="bg-background flex-grow" />{" "}
          {/* Content placeholder */}
          <div className="bg-background dark:bg-background h-32 w-full animate-pulse" />{" "}
          {/* Footer placeholder */}
        </div>
      }>
      <Transition>{children}</Transition>
    </Suspense>
  );
}
```
