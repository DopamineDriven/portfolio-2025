import type { SplitTextProps } from "@/ui/atoms/types/split-text";
import type { Root } from "mdast";
import type { Options as RehypeKatexOpts } from "rehype-katex";
import type {
  CharsElement,
  LineElement,
  Options as RehypePrettyCodeOpts
} from "rehype-pretty-code";
import type { Components, Options as RehypeReactOpts } from "rehype-react";
import type { Options as RehypeSanitizeOptions } from "rehype-sanitize";
import type { Options as RemarkMathOpts } from "remark-math";
import type { Options as RemarkRehypeOpts } from "remark-rehype";
import { Fragment } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { transformerMetaWordHighlight } from "@shikijs/transformers";
import { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";
import { mathmlTags } from "@portfolio/ui";

export function directiveToComponent() {
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

export const sanitizeSchema = {
  allowComments: true,
  allowDoctypes: true,
  ...defaultSchema,
  tagNames: [
    "WavyText",
    "ScatterText",
    "SplitText",
    ...(defaultSchema.tagNames ?? []),
    "video",
    "source",
    "iframe",
    ...mathmlTags,
    "math",
    "mrow",
    "mi",
    "mn",
    "mo",
    "mfrac",
    "msup",
    "msub",
    "msubsup",
    "msqrt",
    "mroot",
    "mtext",
    "mspace",
    "semantics",
    "annotation"
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] ?? []),
      "className",
      "style",
      "id",
      "data-*"
    ],
    math: ["xmlns", "display", "displaystyle"],
    mrow: ["*"],
    mi: ["*"],
    mn: ["*"],
    mo: ["*"],
    mfrac: ["*"],
    msup: ["*"],
    msub: ["*"],
    msubsup: ["*"],
    msqrt: ["*"],
    mroot: ["*"],
    mtext: ["*"],
    mspace: ["*"],
    semantics: ["*"],
    annotation: ["encoding", "*"],
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
  },
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src ?? []), "data"]
  }
} satisfies RehypeSanitizeOptions;

export const rehypeReactOpts = (components: Components) =>
  ({
    jsx: jsxRuntime.jsx,
    jsxs: jsxRuntime.jsxs,
    Fragment,
    components: {
      ...components
    },
    passNode: true
  }) satisfies RehypeReactOpts;

export const rehypeKatexOpts = {
  output: "mathml",
  strict: false,
  trust: true,
  errorColor: "#cc0000"
} satisfies RehypeKatexOpts;

export const remarkMathOpts = {
  singleDollarTextMath: true
} satisfies RemarkMathOpts;

export const remarkRehypeOpts = {
  allowDangerousHtml: true
} satisfies RemarkRehypeOpts;

export const prettyCodeOptions = {
  grid: true,
  keepBackground: true,
  theme: "dark-plus",
  defaultLang: { block: "markdown", inline: "markdown" },
  bypassInlineCode: false,
  onVisitLine(node: LineElement) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node: LineElement) {
    node?.properties?.className?.push("highlighted");
  },
  onVisitHighlightedChars(node: CharsElement) {
    node.properties.className = ["word"];
  },
  transformers: [transformerMetaWordHighlight()]
} satisfies RehypePrettyCodeOpts;
