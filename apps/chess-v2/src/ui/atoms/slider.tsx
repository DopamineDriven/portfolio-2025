"use client";

import type { ComponentPropsWithRef, FC } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends ComponentPropsWithRef<typeof SliderPrimitive.Root> {
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
}

const Slider: FC<SliderProps> = ({
  className,
  ref,
  trackClassName,
  rangeClassName,
  thumbClassName,
  ...props
}) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}>
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full",
        trackClassName ? trackClassName : "bg-primary/20"
      )}>
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full",
          rangeClassName ? rangeClassName : "bg-primary"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full border shadow transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        thumbClassName
          ? thumbClassName
          : "border-primary/50 bg-background focus-visible:ring-1 focus-visible:ring-ring"
      )}
    />
  </SliderPrimitive.Root>
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
