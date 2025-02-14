"use client";

import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
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
        "border/10 z-10 flex size-4 cursor-pointer items-center rounded-md bg-gray-700/10 p-0.5 text-xs text-gray-200 outline-none hover:bg-gray-600/20 focus:outline-none sm:size-8 sm:p-1",
        className
      )}
      aria-label={isCopied ? "Copied!" : "Copy to Clipboard"}>
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 sm:size-6">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 sm:size-6">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}

CopyButton.displayName = "CopyButton";
