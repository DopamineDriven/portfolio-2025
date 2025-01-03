"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = React.useRef<HTMLPreElement>(null);

  const getCode = () => {
    if (codeRef.current) {
      const codeElement = codeRef.current.querySelector("code");
      return codeElement ? codeElement.innerText : "";
    }
    return "";
  };

  return (
    <div className="relative">
      <pre ref={codeRef} className={cn(className, `overflow-x-auto`)}>
        <CopyButton getCodeAction={getCode} />
        {children}
      </pre>
    </div>
  );
}
