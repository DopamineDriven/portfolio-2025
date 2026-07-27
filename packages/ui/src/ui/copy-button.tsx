"use client";

import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
import { Check } from "@/icons/check";
import { Copy } from "@/icons/copy";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends Omit<
  ComponentPropsWithRef<"button">,
  "aria-label" | "onClick"
> {
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
        "border/10 z-10 flex size-4 cursor-pointer items-center rounded-md bg-gray-700/10 p-0.5 text-xs text-gray-200 outline-none hover:bg-gray-600/20 focus:outline-none sm:size-8 sm:p-1",
        className
      )}
      aria-label={isCopied ? "Copied!" : "Copy to Clipboard"}>
      {isCopied ? (
        <Check className="size-5 sm:size-6" />
      ) : (
        <Copy className="size-5 sm:size-6" />
      )}
    </button>
  );
}
