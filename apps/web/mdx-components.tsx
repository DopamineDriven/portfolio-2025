import type { MDXComponents } from "mdx/types";
import type { ImageProps } from "next/image";
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";
import Image from "next/image";
import { CodeBlock } from "@/ui/atoms/code-block";

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
      return <CodeBlock {...props}>{children}</CodeBlock>;
    },
    img: ({ ...props }: ComponentPropsWithRef<typeof Image>) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    )
  };
}
