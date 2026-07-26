"use client";

import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { buttonVariants } from "@/ui/button";
import { cn } from "@/lib/utils";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

type AlertDialogProps<
  T extends
    | "Action"
    | "Description"
    | "Content"
    | "Overlay"
    | "Title"
    | "Cancel"
    | "Trigger"
    | "Portal"
    | "Root"
> = T extends "Action" | "Cancel"
  ? {
      [P in T]: ComponentPropsWithRef<(typeof AlertDialogPrimitive)[P]>;
    }[T] &
      VariantProps<typeof buttonVariants>
  : {
      [P in T]: ComponentPropsWithRef<(typeof AlertDialogPrimitive)[P]>;
    }[T];

function AlertDialog({ ...props }: AlertDialogProps<"Root">) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: AlertDialogProps<"Trigger">) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({ ...props }: AlertDialogProps<"Portal">) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogProps<"Overlay">) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: AlertDialogProps<"Content">) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogProps<"Title">) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogProps<"Description">) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ref,
  ...props
}: AlertDialogProps<"Action">) {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogProps<"Cancel">) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogProps
};
