import type { Unenumerate } from "@/types/helpers";

export type Split<S extends string> = S extends `${infer First}${infer Rest}`
  ? [First, ...Split<Rest>]
  : [];

export type SplitR<S extends string> = S extends `${infer First}${infer Rest}`
  ? readonly [First, ...Split<Rest>]
  : [];

export type AtoZ = `abcdefghijklmnopqrstuvwxyz`;

export type LowerAlphabet = Unenumerate<Split<AtoZ>>;

export type ReverseStr<S extends string> =
  S extends `${infer First}${infer Rest}` ? `${ReverseStr<Rest>}${First}` : S;

export type UpperAlphabet = Uppercase<LowerAlphabet>;

// Combine into one allowed union, along with digits and special characters.
export type AllowedCharacters =
  | LowerAlphabet
  | UpperAlphabet
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "@"
  | "/";

// Revised SortUnion type.
export type SortUnion<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? First extends AllowedCharacters
      ? `${First}${SortUnion<Rest>}`
      : `${SortUnion<Rest>}${First}`
    : T;

export type ReduceConcat<
  T extends readonly string[],
  Acc extends string = ""
> = T extends readonly [
  infer Head extends string,
  ...infer Tail extends string[]
]
  ? ReduceConcat<Tail, `${Acc}${Head}`>
  : Acc;
