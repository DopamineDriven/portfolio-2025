"use client";

import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";

type PopoverProps<T extends "Anchor" | "Content" | "Root" | "Trigger"> =
  T extends "Root"
    ? {
        [P in T]: ComponentPropsWithoutRef<(typeof PopoverPrimitive)[T]>;
      }[T]
    : {
        [P in T]: ComponentPropsWithRef<(typeof PopoverPrimitive)[T]>;
      }[T];

function Popover({ ...props }: PopoverProps<"Root">) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverProps<"Trigger">) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverProps<"Content">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({ ...props }: PopoverProps<"Anchor">) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  type PopoverProps
};
