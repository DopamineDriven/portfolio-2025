import type React from "react";

/* Typed JSON stringify and parse helpers BEGIN */

export type UndefinedAsNull<T> = T extends undefined ? null : T;

export function stringifyJson<
  const T,
  const R extends (string | number)[] | null | undefined,
  const S extends string | number | undefined
>(json: T, replacer: R, space: S) {
  return JSON.stringify(json, replacer, space) as TypedJsonString<T>;
}

export function parseJson<
  const T,
  const R extends ((this: any, key: string, value: any) => any) | undefined
>(stringVal: TypedJsonString<T>, reviver: R) {
  return JSON.parse(stringVal, reviver) as T;
}

export type TypedJsonString<T> = string & {
  [TYPE: symbol]: T;
};

/* Typed JSON stringify & parse helpers END */

/* General Helper Types BEGIN */

export type Unenumerate<T> = T extends readonly (infer U)[] | (infer U)[]
  ? U
  : T;

export type UnwrapPromise<T> = T extends Promise<infer U> | PromiseLike<infer U>
  ? U
  : T;

export type RemoveFields<T, P extends keyof T = keyof T> = {
  [S in keyof T as Exclude<S, P>]: T[S];
};

export type ArrFieldReplacer<
  T extends unknown[] | readonly unknown[],
  V extends keyof Unenumerate<T>,
  Q = false,
  P = unknown
> = T extends (infer U)[] | readonly (infer U)[]
  ? V extends keyof U
    ? Q extends true
      ? P extends Record<V, infer X>
        ? (RemoveFields<U, V> & Record<V, X>)[]
        : (RemoveFields<U, V> & P)[]
      : Q extends false
        ? RemoveFields<U, V>[]
        : U
    : T
  : T;

export type ConditionalToRequired<
  T,
  Z extends keyof T = keyof T
> = RemoveFields<T, Z> & { [Q in Z]-?: T[Q] };

export type RequiredToConditional<
  T,
  X extends keyof T = keyof T
> = RemoveFields<T, X> & { [Q in X]?: T[Q] };

export type FieldToConditionallyNever<
  T,
  X extends keyof T = keyof T
> = RemoveFields<T, X> & { [Q in X]?: XOR<T[Q], never> };

export type ExcludeFieldEnumerable<T, K extends keyof T> = RemoveFields<T, K>;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type IsOptional<T, K extends keyof T> = undefined extends T[K]
  ? object extends Pick<T, K>
    ? true
    : false
  : false;

export type OnlyOptional<T> = {
  [K in keyof T as IsOptional<T, K> extends true ? K : never]: T[K];
};

export type OnlyRequired<T> = {
  [K in keyof T as IsOptional<T, K> extends false ? K : never]: T[K];
};

export type FilterOptionalOrRequired<
  V,
  T extends "conditional" | "required"
> = T extends "conditional" ? OnlyOptional<V> : OnlyRequired<V>;

/* General Helper Types END */

/* React Helper Types BEGIN */

export type InferReactForwardRefExoticComponentProps<T> =
  T extends React.ForwardRefExoticComponent<infer U> ? U : T;

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

export type EventHandler<E extends React.SyntheticEvent<any>> = {
  bivarianceHack(event: E): void;
}["bivarianceHack"];

/* React Helper Types END */

/* Case helper types BEGIN  */

/** Convert literal string types like 'foo-bar' to 'FooBar' */
export type ToPascalCase<S extends string> = string extends S
  ? string
  : S extends `${infer T}-${infer U}`
    ? `${Capitalize<T>}${ToPascalCase<U>}`
    : Capitalize<S>;

/** Convert literal string types like 'foo-bar' to 'fooBar' */
export type ToCamelCase<S extends string> = string extends S
  ? string
  : S extends `${infer T}-${infer U}`
    ? `${T}${ToPascalCase<U>}`
    : S;

/* Case helper types END  */

/* Experimental React Type Helpers BEGIN */

export type InferTsxTargetedFlexi<T> =
  T extends React.DetailedHTMLProps<infer U, infer E> ? readonly [U, E] : T;

export type Selector<
  T,
  K extends "attribute" | "element" | "tuple"
> = T extends readonly [infer A, infer B]
  ? K extends "attribute"
    ? A
    : K extends "element"
      ? B
      : readonly [A, B]
  : T;

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

/* Experimental React Type Helpers END */

/* Helper functions BEGIN */

export function whAdjust<O extends string, T extends number>(
  ogVal: O,
  widthOrHeight?: string | number,
  relAdjust?: T
) {
  return widthOrHeight && relAdjust
    ? typeof widthOrHeight === "string"
      ? Number.parseInt(widthOrHeight, 10) * relAdjust
      : widthOrHeight * relAdjust
    : ogVal;
}

export function omitFields<
  const Target extends { [record: string | symbol | number]: unknown },
  const Key extends keyof Target
>(target: Target, keys: Key[]): RemoveFields<Target, Unenumerate<Key>> {
  /* eslint-disable-next-line prefer-const */
  let obj = target;
  keys.forEach(t => {
    if (t in obj) {
      delete obj[t];
      return obj;
    } else {
      return obj;
    }
  });
  return obj;
}

/* Helper functions END */

/**
 * RT->ReturnType
 *
 * P->Parameters
 *
 * B->Both->{ readonly params: P; readonly returnType: RT; }
 */

export type InferIt<T, V extends "RT" | "P" | "B"> = T extends (
  ...args: infer P
) => infer RT | Promise<infer RT> | PromiseLike<infer RT> | Awaited<infer RT>
  ? V extends "B"
    ? { readonly params: P; readonly returnType: RT }
    : V extends "RT"
      ? RT
      : V extends "P"
        ? P
        : T
  : T;

export type ComputeRange<
  N extends number,
  Result extends unknown[] | readonly unknown[] = []
> = Result["length"] extends N
  ? Result
  : ComputeRange<N, [...Result, Result["length"]]>;

export type Computed<T extends readonly unknown[] | unknown[]> = [
  ...ComputeRange<T["length"]>
]["length"];
// type Tester = `${ComputeRange<2>[number]}`
