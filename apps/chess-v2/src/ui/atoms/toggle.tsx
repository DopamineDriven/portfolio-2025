"use client";

import type { VariantProps } from "class-variance-authority";
import React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const rootClassName = {
  root: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
};

const variants = {
  variant: {
    default: "bg-transparent",
    outline:
      "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground"
  },
  size: {
    default: "h-10 px-3",
    sm: "h-9 px-2.5",
    lg: "h-11 px-5"
  }
};

const toggleVariants = cva(rootClassName.root, {
  variants,
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

const Toggle: React.FC<
  React.ComponentPropsWithRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
> = ({ className, variant, ref, size, ...props }) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
