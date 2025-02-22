"use client";

import type { ComponentPropsWithRef } from "react";
import { AnimateNumber } from "motion-number";
import { cn } from "@/lib/utils";

export type CustomAnimateNumber = ComponentPropsWithRef<typeof AnimateNumber>;

export function AnimateNumberFormatting({
  className,
  ref,
  children,
  ...props
}: CustomAnimateNumber) {
  return (
    <div className="flex flex-col items-center gap-5">
      <AnimateNumber
        format={{
          notation: "compact",
          compactDisplay: "short",
          roundingMode: "trunc",
          style: undefined
        }}
        transition={{
          visualDuration: 0.6,
          type: "spring",
          bounce: 0.25,
          opacity: { duration: 0.3, ease: "linear" }
        }}
        locales="en-US"
        className={cn(className)}
        ref={ref}
        {...props}>
        {children}
      </AnimateNumber>
    </div>
  );
}
