import type { Root } from "mdast";
import type { ComponentPropsWithRef } from "react";
import type { Options as RehypeOptions } from "rehype-pretty-code";
import type { Options as RehypeSanitizeOptions } from "rehype-sanitize";
import React, { createElement, Fragment } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
import { ScatterText } from "@d0paminedriven/motion";
// import {ScatterText, type ScatterTextProps} from "@d0paminedriven/motion";
import { transformerMetaWordHighlight } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { SplitTextProps } from "@/ui/atoms/types/split-text";
import { shimmer } from "@/lib/shimmer";
import { slugify } from "@/lib/slugify";
import { CodeBlock } from "@/ui/atoms/code-block";
import SplitText from "@/ui/atoms/text/split-text";
import WavyText from "@/ui/atoms/text/wavy-text";

function directiveToComponent() {
  // TODO handle object props here by writing them as json objects then parsing them if defined via node.attribute
  // ::splitText{content="Install the gtag types package" as="h4" headingClassName="max-w-3xl font-medium" animateTarget="chars" }
  // ::animatedText{content="Install the gtag types package" as="h4" headingClassName="max-w-3xl font-medium" maxWidth="100%" containerClassName="text-left justify-start" animateTarget="chars" }
  return (tree: Root) => {
    // `visit` each directive node and transform it
    visit(tree, node => {
      // remark-directive attaches these node types:
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        // e.g. `node.name === 'wavyText'` or `splitText`, etc.
        const { name, attributes } = node;

        // For example, if you have `::wavyText{ content="..." maxWidth="..." }`
        // we want to transform it into a custom React component <WavyText ... />
        if (name === "wavyText") {
          node.data = {
            hName: "WavyText",
            hProperties: { ...attributes }
          };
        } else if (name === "splitText") {
          console.log(attributes);
          const attrs = { ...attributes };
          if (
            "keyframes" in attrs &&
            attrs.keyframes &&
            typeof attrs.keyframes === "string"
          )
            (attrs.keyframes as unknown as NonNullable<
              SplitTextProps["keyframes"]
            >) = JSON.parse(attrs.keyframes) as NonNullable<
              SplitTextProps["keyframes"]
            >;
          if (
            "animationOptions" in attrs &&
            attrs.animationOptions &&
            typeof attrs.animationOptions === "string"
          )
            (attrs.animationOptions as unknown as NonNullable<
              SplitTextProps["animationOptions"]
            >) = JSON.parse(attrs.animationOptions) as NonNullable<
              SplitTextProps["animationOptions"]
            >;
          if (
            "withStagger" in attrs &&
            attrs.withStagger &&
            typeof attrs.withStagger === "string"
          )
            (attrs.withStagger as unknown as NonNullable<
              SplitTextProps["withStagger"]
            >) = JSON.parse(attrs.withStagger) as NonNullable<
              SplitTextProps["withStagger"]
            >;
          console.log(attrs);
          node.data = {
            hName: "SplitText",
            hProperties: { ...attrs }
          };
        } else if (name === "scatterText") {
          console.log(attributes);
          node.data = {
            hName: "ScatterText",
            hProperties: { ...attributes }
          };
        }
      }
    });
  };
}
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
};

export async function processMDXToReact(content: string) {
  const processor = unified();
  processor.use(remarkParse);
  processor.use(remarkGfm);
  processor.use(remarkDirective);
  processor.use(directiveToComponent);

  processor.use(remarkRehype, { allowDangerousHtml: true });
  processor.use(rehypePrettyCode, options);
  processor.use(rehypeSanitize, {
    allowDoctypes: true,
    tagNames: [
      "WavyText",
      "ScatterText",
      "SplitText",
      ...(defaultSchema.tagNames ?? [])
    ],
    attributes: {
      ...(defaultSchema.attributes ?? {}),
      "*": ["className", "style", "id", "data*"],
      code: ["className", "data*", "style"],
      span: ["className", "style", "data*"],
      pre: ["className", "data*", "style", "tabIndex"],
      ScatterText: [
        "content",
        "maxWidth",
        "id",
        "data*",
        "containerClassName",
        "allowOverflow",
        "as",
        "headingClassName",
        "keyframes",
        "animationOptions",
        "withStagger",
        "animateTarget",
        "headingStyles",
        "containerStyles"
      ],
      SplitText: [
        "content",
        "maxWidth",
        "id",
        "data*",
        "className",
        "as",
        "headingClassName",
        "keyframes",
        "animationOptions",
        "withStagger",
        "animateTarget"
      ],
      WavyText: [
        "content",
        "contentBefore",
        "contentAfter",
        "maxWidth",
        "id",
        "data*",
        "className",
        "as",
        "headingClassName",
        "keyframes",
        "animationOptions",
        "animateTarget"
      ]
    }
  } satisfies RehypeSanitizeOptions);
  processor.use(rehypeReact, {
    jsx: jsxRuntime.jsx,
    jsxs: jsxRuntime.jsxs,
    Fragment: Fragment,
    createElement,
    components: {
      ...components,
      ScatterText: ScatterText,
      WavyText: WavyText,
      SplitText: SplitText
    },
    passNode: true
  });

  const result = await processor.process(content);

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
