import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./src/components/CodeBlock";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) => {
      return <CodeBlock {...props}>{children}</CodeBlock>;
    }
  };
}
