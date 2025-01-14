import type React from "react";

export type Unenumerate<T> = T extends readonly (infer U)[] | (infer U)[]
  ? U
  : T;

export type RemoveFields<T, P extends keyof T = keyof T> = {
  [S in keyof T as Exclude<S, P>]: T[S];
};

export type SVGProperties = RemoveFields<
  React.SVGProps<SVGSVGElement>,
  "viewBox" | "fill" | "xmlns"
> &
  React.Ref<SVGSVGElement>;
