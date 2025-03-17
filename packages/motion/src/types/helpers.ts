/**
 * helper workup for use in XOR type below
 * makes properties from U optional and undefined in T, and vice versa
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * enforces mutual exclusivity of T | U
 */
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * valid width values
 */
export type CSSWidthValue =
  | `${number}px`
  | `${number}%`
  | `${number}rem`
  | `${number}em`
  | `${number}vw`
  | `${number}dvw`
  | `${number}ch`
  | `${number}svw`
  | `${number}lvw`
  | `${number}vmin`
  | `${number}vmax`
  | `${number}lvmin`
  | `${number}lvmax`
  | `${number}svmin`
  | `${number}svmax`
  | `${number}dvmin`
  | `${number}dvmax`
  | `${number}vi`
  | `${number}lvi`
  | `${number}svi`
  | `${number}lvb`
  | `${number}svb`
  | `${number}dvb`
  | `${number}/${number}`
  | "full"
  | "fit"
  | "auto"
  | "none";

/** HTML tag to be used for the text element (not comprehensive)
 *
 * Note: the following omits void html Tags (they accept no children) and is more comprehensive but creates a complex union
 *
 * `Exclude<keyof React.JSX.IntrinsicElements, "area" | "base" | "br" | "col" | "command" | "embed" | "hr" | "img" | "input" | "keygen" | "link" | "meta" | "param" | "source" | "track" | "wbr">`
 */

export type TextElementTagUnion =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "pre"
  | "cite"
  | "address"
  | "aside"
  | "blockquote"
  | "caption"
  | "figcaption"
  | "code"
  | "article"
  | "header"
  | "mark"
  | "sup"
  | "label"
  | "title"
  | "small"
  | "sub"
  | "details"
  | "ins"
  | "del"
  | "figure"
  | "li"
  | "i"
  | "kbd"
  | "summary";
