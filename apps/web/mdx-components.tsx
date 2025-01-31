import type { MDXComponents } from "mdx/types";
import type { ImageProps } from "next/image";
import type { ComponentPropsWithRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CodeBlock } from "@/ui/atoms/code-block";

function CustomLink({
  href,
  children,
  ...props
}: React.LinkHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    a: CustomLink,
    pre: ({ children, ...props }: ComponentPropsWithRef<"pre">) => {
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
