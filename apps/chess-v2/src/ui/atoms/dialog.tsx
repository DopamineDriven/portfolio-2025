"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { TsxTargetedReact19 } from "@/types/react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay: React.FC<
  React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>
> = ({ className, ref, ...props }) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-xs", className)}
    {...props}
  />
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent: React.FC<
  React.ComponentPropsWithRef<typeof DialogPrimitive.Content>
> = ({ className, children, ref, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      aria-describedby=""
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        className
      )}
      {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter: React.FC<TsxTargetedReact19<"div">> = ({
  className,
  ref,
  ...props
}) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle: React.FC<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
> = ({ className, ...props }) => (
  <DialogPrimitive.Title
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription: React.FC<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
> = ({ className, ...props }) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};
