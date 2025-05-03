// import type {Property} from "csstype"
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

// type WidthValue<TLength = (string & {}) | 0> = Property.MaxWidth<TLength>

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
  | "a"
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
  | "button"
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
  | "ol"
  | "ul"
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

/**
 * DIVISION
 // Given helpers from your code:
type ComputeRange<
  N extends number,
  Result extends unknown[] = []
> = Result['length'] extends N
      ? Result
      : ComputeRange<N, [...Result, Result['length']]>;

type BuildArray<Length extends number, Arr extends unknown[] = []> =
  Arr['length'] extends Length ? Arr : BuildArray<Length, [...Arr, unknown]>;

// Maps every element of a tuple T to a value U
type MapArray<T extends unknown[], U> =
  T extends [infer First, ...infer Rest]
    ? [U, ...MapArray<Rest, U>]
    : [];

// Flattens an array of arrays into one array
type Flatten<T extends unknown[][]> =
  T extends [infer Head extends unknown[], ...infer Tail extends unknown[][]]
    ? [...Head, ...Flatten<Tail>]
    : [];

// Multiply by mapping each element of a BuildArray<B> to ComputeRange<A>, then flattening.
type Multiply<A extends number, B extends number> =
  // @ts-expect-error excessive stack depth
  Flatten<MapArray<BuildArray<B>, ComputeRange<A>>>['length'];

// For example, Multiply<8,5> === 40.
type TestMultiply = Multiply<8, 5>;

//
// New Helpers for Division
//

// Subtract: Given two numbers A and B (with A >= B), compute A - B.
type Subtract<A extends number, B extends number> =
  BuildArray<A> extends [...BuildArray<B>, ...infer R]
    ? R['length']
    : never;

// DivideInteger: Computes the integer (floor) quotient by repeatedly subtracting D from N.
type DivideInteger<
  N extends number,
  D extends number,
  Count extends unknown[] = []
> = BuildArray<N> extends [...BuildArray<D>, ...infer R]
    ? DivideInteger<R['length'], D, [...Count, unknown]>
    : Count['length'];

// DivideFraction: Recursively computes the decimal (fraction) digits.
// It multiplies the remainder by 10, finds the next digit via integer division,
// subtracts digit*D, and continues until Precision is 0 or the remainder becomes 0.
type DivideFraction<
  R extends number,     // current remainder
  D extends number,     // divisor
  Precision extends number, // remaining decimal places to compute
  Digits extends string = ""
> = Precision extends 0 ? Digits :
    R extends 0 ? Digits :
    Multiply<R, 10> extends infer T ?
      T extends number ?
        DivideInteger<T, D> extends infer Digit ?
          Digit extends number ?
            Multiply<Digit, D> extends infer Prod ?
              Prod extends number ?
                Subtract<T, Prod> extends infer NewR ?
                  NewR extends number ?
                    DivideFraction<NewR, D, Subtract<Precision, 1>, `${Digits}${Digit}`>
                  : never
                : never
              : never
            : never
          : never
        : never
      : never: never;

// Divide: Combines the integer and fractional parts. If there’s no remainder,
// it simply returns the integer part. Otherwise, it returns a template literal
// combining the integer part and the fractional digits.
type Divide<
  N extends number,
  D extends number,
  Precision extends number = 4
> = DivideInteger<N, D> extends infer I ?
      I extends number ?
        Multiply<I, D> extends infer Prod ?
          Prod extends number ?
            Subtract<N, Prod> extends infer R ?
              R extends number ?
                R extends 0 ? I : `${I}.${DivideFraction<R, D, Precision>}`
              : never
            : never
          : never
        : never
      : never : never;

type InferFloat<T> = T extends `${infer U}` ? U : T;

// Test: Divide 4 by 3 should be inferred as "1.3333"
type TestDivision = Divide<4, 3>;


const x = <const V extends number, const Z extends number>(props: readonly [V,Z]) => {
  return (props[0]/props[1]).toPrecision(10) as Divide<V,Z>;
}

const y = x([4,3])

// Hovering over TestDivision shows: "1.3333"

 */
