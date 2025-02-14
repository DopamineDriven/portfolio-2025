"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/ui/atoms/copy-button";

export interface CodeBlockProps
  extends Omit<ComponentPropsWithRef<"pre">, "children"> {
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
    <div className="relative m-0 w-full p-0">
      <pre
        ref={codeRef}
        className={cn(className, `overflow-x-auto p-0`)}
        {...rest}>
        {children}
      </pre>
      <div className="code-header absolute top-0 right-0 cursor-pointer">
        <CopyButton getCodeAction={getCode} />
      </div>
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";
