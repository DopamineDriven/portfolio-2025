"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

type ToastViewportProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Viewport
> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitives.Viewport>>;
};

const ToastViewport = ({ className, ...props }: ToastViewportProps) => (
  <ToastPrimitives.Viewport
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-[hsl(222.2,84%,4.9%)]",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants> & {
    ref?: React.Ref<React.ComponentRef<typeof ToastPrimitives.Root>>;
  };

const Toast = ({ className, variant, ...props }: ToastProps) => {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

type ToastActionProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Action
> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitives.Action>>;
};

const ToastAction = ({ className, ...props }: ToastActionProps) => (
  <ToastPrimitives.Action
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium text-[hsl(222.2,84%,4.9%)] ring-offset-background transition-colors hover:bg-secondary focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive",
      className
    )}
    {...props}
  />
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

type ToastCloseProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Close
> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitives.Close>>;
};

const ToastClose = ({ className, ...props }: ToastCloseProps) => (
  <ToastPrimitives.Close
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-[hsl(222.2,84%,4.9%)]/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}>
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

type ToastTitleProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Title
> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitives.Title>>;
};

const ToastTitle = ({ className, ...props }: ToastTitleProps) => (
  <ToastPrimitives.Title
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

type ToastDescriptionProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Description
> & {
  ref?: React.Ref<React.ComponentRef<typeof ToastPrimitives.Description>>;
};

const ToastDescription = ({ className, ...props }: ToastDescriptionProps) => (
  <ToastPrimitives.Description
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
);
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
};
