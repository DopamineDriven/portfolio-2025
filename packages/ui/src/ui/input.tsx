"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends ComponentPropsWithRef<"input"> {}
function Input({ className, type = "search", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 file:text-foreground selection:bg-primary selection:text-primary-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-10 w-full rounded-md border py-2 text-base file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[0.1875rem] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`,
        className
      )}
      {...props}
    />
  );
}

export { Input, type InputProps };
