"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/ui/atoms/copy-button";

export interface CodeBlockProps
  extends Omit<ComponentPropsWithoutRef<"pre">, "children"> {
  children: ReactNode;
}

export function CodeBlock({ children, className, ...rest }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  const getCode = () => {
    if (codeRef.current) {
      const codeElement = codeRef.current.querySelector("code");
      return codeElement ? codeElement.innerText : "";
    }
    return "";
  };

  return (
    <div className="relative">
      <pre ref={codeRef} className={cn(className, `overflow-x-auto`)} {...rest}>
        <CopyButton getCodeAction={getCode} />
        {children}
      </pre>
    </div>
  );
}
