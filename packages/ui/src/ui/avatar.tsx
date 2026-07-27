"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

type AvatarProps<T extends "Root" | "Image" | "Fallback"> =
  ComponentPropsWithRef<(typeof AvatarPrimitive)[T]>;

function Avatar({ className, ...props }: AvatarProps<"Root">) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, src, ...props }: AvatarProps<"Image">) {
  return (
    <AvatarPrimitive.Image
      src={src}
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarProps<"Fallback">) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, type AvatarProps };
