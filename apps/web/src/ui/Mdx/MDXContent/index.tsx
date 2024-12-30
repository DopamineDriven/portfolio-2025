import type { JSX } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { CodeBlockProps } from "@/ui/Mdx/CodeBlock";
import CodeBlock from "@/ui/Mdx/CodeBlock";

export type MDXComponents = {
  [key: string]: React.ComponentType<any>;
};

const components = {
  code: (props: CodeBlockProps) => <CodeBlock {...props} />
};

export interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps): JSX.Element {
  return <MDXRemote source={source} components={components} />;
}
