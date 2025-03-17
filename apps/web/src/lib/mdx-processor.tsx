import type { ComponentPropsWithRef } from "react";
import type { Options as RehypeOptions } from "rehype-pretty-code";
import React, { createElement, Fragment } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
// import {ScatterText, type ScatterTextProps} from "@d0paminedriven/motion";
import { transformerMetaWordHighlight } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { shimmer } from "@/lib/shimmer";
import { slugify } from "@/lib/slugify";
import { CodeBlock } from "@/ui/atoms/code-block";

interface CustomImageProps extends ComponentPropsWithRef<typeof Image> {
  "data-zoomable"?: boolean;
  [key: string]: any;
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    const target =
      `h${level}` as const satisfies keyof React.JSX.IntrinsicElements;
    return createElement(
      target,
      { id: slug },
      [
        createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor"
        })
      ],
      children
    );
  };
  Heading.displayName = `Heading${level}`;

  return Heading;
}

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
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
const options = {
  grid: true,
  keepBackground: true,
  theme: "dark-plus",
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node?.properties?.className?.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
  transformers: [transformerMetaWordHighlight()]
} satisfies RehypeOptions;

function CustomImage({
  src,
  alt = "",
  width = 800,
  height = 600,
  "data-zoomable": _zoomable,
  ...props
}: CustomImageProps) {
  // If you want to implement zoomable images, you can check the zoomable prop here
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={shimmer([width, height])}
      sizes="100vw"
      style={{ width: "100%", height: "auto", objectFit: "cover" }}
      {...props}
    />
  );
}
// Client component wrapper for SplitText

const components = {
  a: CustomLink,
  pre: ({ children, ...props }: ComponentPropsWithRef<"pre">) => {
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),

  // h4: ({ children }: { children: string }) => {
  //   return (
  //     <ScatterText
  //       content={children}
  //       containerStyles={{alignItems: "start"}}
  //       as={"h4"}allowOverflow={true}
  //       headingClassName="text-left"
  //     />
  //   );
  // },
  h5: createHeading(5),
  h6: createHeading(6),
  img: CustomImage
  // animatedText: ScatterText
};

export async function processMDXToReact(content: string) {
  const processor = unified();
  processor.use(remarkParse);
  processor.use(remarkGfm);
  processor.use(remarkRehype, { allowDangerousHtml: true });
  processor.use(rehypePrettyCode, options);
  processor.use(rehypeSanitize, {
    attributes: {
      "*": ["className", "style", "id", "data*"],
      code: ["className", "data*", "style"],
      span: ["className", "style", "data*"],
      pre: ["className", "data*", "style", "tabIndex"]
    }
  });
  processor.use(rehypeReact, {
    jsx: jsxRuntime.jsx,
    jsxs: jsxRuntime.jsxs,
    Fragment: Fragment,
    createElement,
    components,
    passNode: true
  });

  const result = await processor.process(content);

  // The result.result contains the React elements
  return result.result as React.ReactElement;
}
// declare module "react" {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace JSX {
//     interface IntrinsicElements {
//       "animatedText": ScatterTextProps;
//     }
//   }
// }
