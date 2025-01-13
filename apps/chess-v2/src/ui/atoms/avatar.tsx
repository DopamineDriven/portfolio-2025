"use client";

import type { ComponentPropsWithRef, FC } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar: FC<ComponentPropsWithRef<typeof AvatarPrimitive.Root>> = ({
  className,
  ref,
  ...props
}) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage: FC<ComponentPropsWithRef<typeof AvatarPrimitive.Image>> = ({
  className,
  ref,
  ...props
}) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback: FC<
  ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>
> = ({ className, ref, ...props }) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-sm bg-muted",
      className
    )}
    {...props}
  />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
