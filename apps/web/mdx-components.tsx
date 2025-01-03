import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./src/components/CodeBlock";
import Image, { type ImageProps } from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: ({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) => {
      return <CodeBlock {...props}>{children}</CodeBlock>;
    },
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
  };
}
