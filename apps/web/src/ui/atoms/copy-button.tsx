"use client";

import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "aria-label" | "onClick"> {
  getCodeAction: () => string;
}

export function CopyButton({
  getCodeAction,
  className,
  ...rest
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }

    try {
      const code = getCodeAction();
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.warn("Copy failed", error);
      setIsCopied(false);
    }
  };

  return (
    <button
      {...rest}
      onClick={copy}
      className={cn(
        "absolute top-2 right-2 z-10 h-8 w-8 rounded-md border bg-gray-700 p-1.5 text-gray-200 hover:bg-gray-600",
        className
      )}
      aria-label={isCopied ? "Copied!" : "Copy code to clipboard"}>
      {isCopied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

CopyButton.displayName="CopyButton";
