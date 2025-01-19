"use client";

import React from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  getCodeAction: () => string;
}

export function CopyButton({ getCodeAction }: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

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
      onClick={copy}
      className="absolute right-2 top-2 z-10 h-8 w-8 rounded-md border bg-gray-700 p-1.5 text-gray-200 hover:bg-gray-600"
      aria-label={isCopied ? "Copied!" : "Copy code to clipboard"}>
      {isCopied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}
