export type InferExciseColonOutput<T> = T extends `${infer U}:${infer V}`
  ? T extends `${infer U}:${infer V}:${infer W}`
    ? T extends `${infer U}:${infer V}:${infer W}:${infer X}`
      ? T extends `${infer U}:${infer V}:${infer W}:${infer X}:${infer Y}`
        ? T extends `${infer U}:${infer V}:${infer W}:${infer X}:${infer Y}:${infer Z}`
          ? [U, V, W, X, Y, Z]
          : [U, V, W, X, Y]
        : [U, V, W, X]
      : [U, V, W]
    : [U, V]
  : T;

export type Unenumerate<T> = T extends readonly (infer U)[] | (infer U)[]
  ? U
  : T;

export type Split<S extends string> = S extends `${infer First}${infer Rest}`
  ? [First, ...Split<Rest>]
  : [];

export type LowerAlphabet = Unenumerate<Split<"abcdefghijklmnopqrstuvwxyz">>;

export type Digit = Unenumerate<Split<`0123456789`>>;

export type TopoDataTypeValueUnion = InstanceType<
  typeof import("@/iso-3166-1/index.ts").default
>["topoDataByCountryCode"][keyof InstanceType<
  typeof import("@/iso-3166-1/index.ts").default
>["topoDataByCountryCode"]];

export type Alpha2Union = InferIsoDataTypeTargeted<
  TopoDataTypeValueUnion,
  "alpha-2"
>;

export type Alpha3Union = InferIsoDataTypeTargeted<
  TopoDataTypeValueUnion,
  "alpha-3"
>;

export type CountryNameUnion = InferIsoDataTypeTargeted<
  TopoDataTypeValueUnion,
  "country-name"
>;

export type CountryCodeUnion = keyof InstanceType<
  typeof import("@/iso-3166-1/index.ts").default
>["topoDataByCountryCode"];

export type InferIsoDataTypeTargeted<
  T,
  V extends "alpha-2" | "alpha-3" | "country-name"
> = T extends `${infer X}:${infer Y}:${infer Z}`
  ? V extends "alpha-2"
    ? X
    : V extends "alpha-3"
      ? Y
      : Z
  : never;
