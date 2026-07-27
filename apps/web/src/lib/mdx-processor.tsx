import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { createHeading } from "@/lib/create-heading";
import { preprocessMathDelimiters } from "@/lib/preprocess";
import {
  directiveToComponent,
  prettyCodeOptions,
  rehypeKatexOpts,
  rehypeReactOpts,
  remarkMathOpts,
  remarkRehypeOpts,
  sanitizeSchema
} from "@/lib/processor-opts";
import { shimmer } from "@/lib/shimmer";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/ui/atoms/code-block";
import SplitText from "@/ui/atoms/text/split-text";
import WavyText from "@/ui/atoms/text/wavy-text";
import { ScatterText } from "@d0paminedriven/motion";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { VFile } from "vfile";

interface CustomImageProps extends ComponentPropsWithRef<typeof Image> {
  "data-zoomable"?: boolean;
  [key: string]: any;
}

function CustomLink({ href, children, ...props }: ComponentPropsWithRef<"a">) {
  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className={cn(
          props.className,
          "overflow-x-hidden wrap-break-word whitespace-normal"
        )}
        {...props}>
        {children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return (
      <Link
        href={href}
        className={cn(
          props.className,
          "overflow-x-hidden wrap-break-word whitespace-normal"
        )}
        {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        props.className,
        "overflow-x-hidden wrap-break-word whitespace-normal"
      )}
      target="_blank"
      rel="noopener noreferrer"
      {...props}>
      {children}
    </a>
  );
}

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
  h5: createHeading(5),
  h6: createHeading(6),
  img: CustomImage,
  p: ({ className, children, ...props }: ComponentPropsWithRef<"p">) => (
    <p className={cn("mb-1.5 leading-7 wrap-anywhere", className)} {...props}>
      {children}
    </p>
  ),
  li: ({ className, children, ...props }: ComponentPropsWithRef<"li">) => (
    <li
      className={cn(
        "leading-7 whitespace-normal! [&>p]:mb-1 [&>p:last-child]:mb-0",
        className
      )}
      {...props}>
      {children}
    </li>
  ),
  ol: ({ className, children, ...props }: ComponentPropsWithRef<"ol">) => (
    <ol
      className={cn(
        "mb-2 ml-6 list-decimal [&_ol]:mt-1 [&_ol]:mb-0 [&_ul]:mt-1 [&_ul]:mb-0 [&>li]:pl-1.5",
        className
      )}
      {...props}>
      {children}
    </ol>
  ),
  ul: ({ className, children, ...props }: ComponentPropsWithRef<"ul">) => (
    <ul
      className={cn(
        "mb-2 ml-6 list-disc space-y-0.5 [&_ol]:mt-1 [&_ol]:mb-0 [&_ul]:mt-1 [&_ul]:mb-0 [&>li]:pl-1.5",
        className
      )}
      {...props}>
      {children}
    </ul>
  ),
  div: ({ className, children, ...props }: ComponentPropsWithRef<"div">) => (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  ),
  span: ({ children, className, ...props }: ComponentPropsWithRef<"span">) => (
    <span className={cn(className)} {...props}>
      {children}
    </span>
  ),
  blockquote: ({
    children,
    className,
    ...props
  }: ComponentPropsWithRef<"blockquote">) => (
    <blockquote
      className={cn(
        "mb-2 border-l-4 pl-4 wrap-anywhere break-all hyphens-auto whitespace-pre-wrap italic",
        className
      )}
      {...props}>
      {children}
    </blockquote>
  ),
  cite: ({ className, children, ...props }: ComponentPropsWithRef<"cite">) => (
    <cite className={cn(className)} {...props}>
      {children}
    </cite>
  ),
  hr: ({ className, ...props }: ComponentPropsWithRef<"hr">) => (
    <hr className={cn(className)} {...props} />
  ),
  br: ({ className, ...props }: ComponentPropsWithRef<"br">) => (
    <br className={cn(className)} {...props} />
  ),
  caption: ({
    className,
    children,
    ...props
  }: ComponentPropsWithRef<"caption">) => (
    <caption className={cn(className)} {...props}>
      {children}
    </caption>
  ),
  em: ({ className, children, ...props }: ComponentPropsWithRef<"em">) => (
    <em className={cn("wrap-anywhere", className)} {...props}>
      {children}
    </em>
  ),
  strong: ({
    className,
    children,
    ...props
  }: ComponentPropsWithRef<"strong">) => (
    <strong className={cn("font-bold wrap-anywhere", className)} {...props}>
      {children}
    </strong>
  ),
  b: ({ className, children, ...props }: ComponentPropsWithRef<"b">) => (
    <b className={cn("font-bold wrap-anywhere", className)} {...props}>
      {children}
    </b>
  ),
  aside: ({
    className,
    children,
    ...props
  }: ComponentPropsWithRef<"aside">) => (
    <aside className={cn(className)} {...props}>
      {children}
    </aside>
  ),
  table: ({
    children,
    className,
    ...props
  }: ComponentPropsWithRef<"table">) => (
    <div
      className="-mx-3 my-3 scrollbar-none overflow-x-auto overscroll-x-contain px-3 [-webkit-overflow-scrolling:touch] md:mx-0 [&::-webkit-scrollbar]:hidden"
      role="region"
      aria-label="Scrollable table">
      <table
        className={cn(
          "mb-4 w-full min-w-[80dvw] table-auto border-collapse",
          "border text-sm",
          className
        )}
        {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    className,
    ...props
  }: ComponentPropsWithRef<"thead">) => (
    <thead
      className={cn(
        "px-2.5 py-2 text-left align-top text-sm",
        "wrap-break-words whitespace-normal",
        className
      )}
      {...props}>
      {children}
    </thead>
  ),
  tbody: ({
    className,
    children,
    ...props
  }: ComponentPropsWithRef<"tbody">) => (
    <tbody className={cn(className)} {...props}>
      {children}
    </tbody>
  ),
  tspan: ({
    className,
    children,
    ...props
  }: ComponentPropsWithRef<"tspan">) => (
    <tspan className={cn(className)} {...props}>
      {children}
    </tspan>
  ),
  tfoot: ({
    className,
    children,
    ...props
  }: ComponentPropsWithRef<"tfoot">) => (
    <tfoot className={cn(className)} {...props}>
      {children}
    </tfoot>
  ),
  tr: ({ className, children, ...props }: ComponentPropsWithRef<"tr">) => (
    <tr className={cn("border-b", className)} {...props}>
      {children}
    </tr>
  ),
  td: ({ children, className, ...props }: ComponentPropsWithRef<"td">) => (
    <td
      className={cn(
        "px-3 py-1.5 align-top text-xs",
        "wrap-break-word hyphens-auto whitespace-normal",
        "[&_a]:wrap-break-word [&_code]:wrap-break-word [&_li]:wrap-break-word",
        className
      )}
      {...props}>
      {children}
    </td>
  ),
  th: ({ children, className, ...props }: ComponentPropsWithRef<"th">) => (
    <th
      className={cn(
        "border px-2.5 py-2 text-left align-top text-xs font-semibold",
        "wrap-break-word whitespace-normal",
        className
      )}
      {...props}>
      {children}
    </th>
  )
};

export async function processMDXToReact(content: string) {
  const preprocessedContent = preprocessMathDelimiters(content);
  const processor = unified();
  processor.use(remarkParse);
  processor.use(remarkGfm);
  processor.use(remarkMath, remarkMathOpts);
  processor.use(remarkDirective);
  processor.use(directiveToComponent);
  processor.use(remarkRehype, remarkRehypeOpts);
  processor.use(rehypeSanitize, sanitizeSchema);
  processor.use(rehypeKatex, rehypeKatexOpts);
  processor.use(rehypePrettyCode, prettyCodeOptions);
  processor.use(
    rehypeReact,
    rehypeReactOpts({
      ...components,
      ScatterText: ScatterText,
      WavyText: WavyText,
      SplitText: SplitText
    })
  );

  const file = new VFile({ value: preprocessedContent });
  const result = await processor.process(file);

  return result.result as ReactElement satisfies ReactNode;
}
// declare module "react" {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace JSX {
//     interface IntrinsicElements {
//       "animatedText": ScatterTextProps;
//     }
//   }
// }
