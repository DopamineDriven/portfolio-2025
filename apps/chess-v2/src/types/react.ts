import type React from "react";
import type { RemoveFields, Unenumerate } from "@/types/helpers";

export type InferTsxTargeted<T> =
  T extends React.DetailedHTMLProps<infer U, Element> ? U : T;

export type TsxTargeted<T extends keyof React.JSX.IntrinsicElements> = {
  [P in T]: InferTsxTargeted<React.JSX.IntrinsicElements[P]>;
}[T];

export type TsxExclude<
  T extends keyof React.JSX.IntrinsicElements,
  J extends keyof TsxTargeted<T>
> = RemoveFields<TsxTargeted<T>, J>;

export type TsxInclude<
  T extends keyof React.JSX.IntrinsicElements,
  J extends keyof TsxTargeted<T>
> = RemoveFields<TsxTargeted<T>, Exclude<keyof TsxTargeted<T>, J>>;

export type InferTsxTargetedFlexi<T> =
  T extends React.DetailedHTMLProps<infer U, infer E>
    ? readonly [U, E] | [U, E]
    : T;

export type InferTsxReact19<T> =
  T extends React.DetailedHTMLProps<infer U, infer E>
    ? readonly [U, E] | [U, E]
    : T;

export type Selector<
  T,
  K extends "attribute" | "element" | "tuple"
> = T extends readonly [infer A, infer B]
  ? K extends "attribute"
    ? A
    : K extends "element"
      ? B
      : readonly [A, B]
  : T extends [infer A, infer B]
    ? K extends "attribute"
      ? A
      : K extends "element"
        ? B
        : [A, B]
    : T;

export type TsxTargetedReact19<T extends keyof React.JSX.IntrinsicElements> = {
  [P in T]: Selector<
    InferTsxReact19<React.JSX.IntrinsicElements[P]>,
    "attribute"
  > & {
    ref?: React.Ref<
      Selector<InferTsxReact19<React.JSX.IntrinsicElements[P]>, "element">
    >;
  };
}[T];

export type TsxExcludeReact19<
  T extends keyof React.JSX.IntrinsicElements,
  P extends keyof TsxTargetedReact19<T>
> = RemoveFields<TsxTargetedReact19<T>, P>;

export type TsxIncludeReact19<
  T extends keyof React.JSX.IntrinsicElements,
  J extends keyof TsxTargetedReact19<T>
> = RemoveFields<
  TsxTargetedReact19<T>,
  Exclude<keyof TsxTargetedReact19<T>, J>
>;
export type FlexiKeys = Unenumerate<readonly ["attribute", "element", "tuple"]>;

export type TsxTargetedExp<
  T extends keyof React.JSX.IntrinsicElements,
  K extends FlexiKeys
> = {
  readonly [P in T]: Selector<
    InferTsxTargetedFlexi<React.JSX.IntrinsicElements[P]>,
    K
  >;
}[T];

export type TsxExcludeExp<
  I extends FlexiKeys,
  K extends keyof React.JSX.IntrinsicElements,
  J extends keyof TsxTargetedExp<K, I>
> = RemoveFields<TsxTargetedExp<K, I>, J>;

export type TsxIncludeExp<
  I extends FlexiKeys,
  K extends keyof React.JSX.IntrinsicElements,
  J extends keyof TsxTargetedExp<K, I>
> = RemoveFields<TsxTargetedExp<K, I>, Exclude<keyof TsxTargetedExp<K, I>, J>>;

export type ElementAttributePicker<
  T extends keyof React.JSX.IntrinsicElements
> = React.RefAttributes<TsxTargetedExp<T, "element">> &
  Partial<TsxTargetedExp<T, "attribute">>;

export type CSSTargeted<T extends keyof React.CSSProperties> = {
  [P in T]: React.CSSProperties[P];
};

export type CSSExclude<T extends keyof React.CSSProperties> = RemoveFields<
  CSSTargeted<T>,
  T
>;

export type CSSInclude<T extends keyof React.CSSProperties> = RemoveFields<
  CSSTargeted<T>,
  Exclude<keyof CSSTargeted<T>, T>
>;
