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
  | `calc(${number | string})`
  | "full"
  | "fit"
  | "none"
  | "-moz-initial"
  | "inherit"
  | "initial"
  | "revert"
  | "revert-layer"
  | "unset"
  | "-moz-fit-content"
  | "-moz-max-content"
  | "-moz-min-content"
  | "-webkit-fit-content"
  | "-webkit-max-content"
  | "-webkit-min-content"
  | "fit-content"
  | "intrinsic"
  | "max-content"
  | "min-content";

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


/**
   * Type Multiplication
   type ComputeRange<
  N extends number,
  Result extends unknown[] = []
> = Result['length'] extends N
      ? Result
      : ComputeRange<N, [...Result, Result['length']]>;

type BuildArray<Length extends number, Arr extends unknown[] = []> =
  Arr['length'] extends Length ? Arr : BuildArray<Length, [...Arr, unknown]>;

// A helper type that maps every element of a tuple T to a value U
type MapArray<T extends unknown[], U> =
  T extends [infer First, ...infer Rest]
    ? [U, ...MapArray<Rest, U>]
    : [];

// The Flatten helper recursively concatenates an array of arrays into one array
type Flatten<T extends unknown[][]> =
  T extends [infer Head extends unknown[], ...infer Tail extends unknown[][]]
    ? [...Head, ...Flatten<Tail>]
    : [];

// Multiply by mapping each element of a BuildArray<B> to ComputeRange<A>, then flattening.
type Multiply<A extends number, B extends number> =
  // @ts-expect-error excessive stack depth
  Flatten<MapArray<BuildArray<B>, ComputeRange<A>>>['length'];

// Multiplty<8,5> = 40; Multiplty<8,6> = 48; etc
type Test = Multiply<8,5>;
*/
