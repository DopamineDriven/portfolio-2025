import type { ComponentPropsWithRef, JSX, ReactNode } from "react";
import { createElement } from "react";
import { slugify } from "@/lib/slugify";

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading = ({
    children,
    ...rest
  }: { children: ReactNode } & Omit<
    ComponentPropsWithRef<`h${typeof level}`>,
    "children"
  >) => {
    const slug = typeof children === "string" ? slugify(children) : "";
    const target = `h${level}` as const satisfies keyof JSX.IntrinsicElements;
    const createElementHeadingStyles = {
      id: slug,
      className:
        "[h1]:text-4xl [h2]:text-3xl [h3]:text-2xl [h4]:text-2xl [h5]:text-xl [h6]:text-lg wrap-break-word whitespace-normal",
      ...rest
    };
    return createElement(target, createElementHeadingStyles, [
      createElement(
        "a",
        {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor hover:text-current/95 ease-in-out wrap-break-word "
        },
        [children]
      )
    ]);
  };
  Heading.displayName = `Heading${level}`;

  return Heading;
}

export { createHeading };
