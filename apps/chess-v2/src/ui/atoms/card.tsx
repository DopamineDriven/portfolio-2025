"use client";

import React from "react";
import type { TsxTargetedReact19 } from "@/types/react";
import { cn } from "@/lib/utils";

const Card: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl grow border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardHeader: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

const CardTitle: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

const CardDescription: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

const CardContent: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => <div ref={ref} className={cn("pt-0", className)} {...props} />;
CardContent.displayName = "CardContent";

const CardFooter: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
};
