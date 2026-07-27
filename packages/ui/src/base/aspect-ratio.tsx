import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

interface BaseAspectRatioProps extends ComponentPropsWithRef<"div"> {
  ratio: number;
}

function BaseAspectRatio({ ratio, className, ...props }: BaseAspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{
        "--ratio": ratio
      }}
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  );
}

export { BaseAspectRatio, type BaseAspectRatioProps };
 