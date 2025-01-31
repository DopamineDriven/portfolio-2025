import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "../../../mdx-components";

export function MdxRenderer({
  source,
  options
}: Omit<MDXRemoteProps, "components">) {
  const components = useMDXComponents({});
  return (
    <MDXRemote
      source={source}
      components={components}
      options={options}
    />
  );
}
