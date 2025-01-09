"use client";

import type { ComponentPropsWithRef, FC } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Label: FC<ComponentPropsWithRef<typeof LabelPrimitive.Root>> = ({
  className,
  ref,
  ...props
}) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
