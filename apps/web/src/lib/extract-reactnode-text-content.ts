import type { ReactNode } from "react";
import React from "react";

export function extractTextContent(node: ReactNode): string {
  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return node.toString(10);
  }

  if (Array.isArray(node)) {
    return node.map(e => e).join("");
  }

  if (React.isValidElement(node)) {
    const children = (
      node?.props as { children?: ReactNode; [record: string]: unknown }
    ).children;
    return children ? (extractTextContent(children) as string) : "" as string;
  }

  return "" as string;
}
