export type StripUnderscore<T extends string> =
  T extends `${infer X}_${infer Y}` ? `${X}${StripUnderscore<Y>}` : T;

export type StripCommas<T extends string> = T extends `${infer X},${infer Y}`
  ? `${X}${StripCommas<Y>}`
  : T;

// union of reverse-ordered recursive character stripping

export type InferStrip<T> = T extends StripSeparators<infer U> ? U : T;
export type StripSeparators<T extends string> = StripCommas<StripUnderscore<T>>;
export const stripSeparators = <const T extends string>(
  s: T
): InferStrip<StripSeparators<T>> =>
  s.replace(/(_|,)/g, "") as InferStrip<StripSeparators<T>>;

export function isDecimal<const T extends number | string>(s: T) {
  const v = typeof s === "string" ? Number.parseInt(s) : s;
  if (Number.isNaN(v)) throw new Error(`${s} isNaN`);
  if (typeof s === "number") {
    return /\./g.test(s.toPrecision(10));
  } else {
    return /\./g.test(s);
  }
}

export function toN<const V extends number | string>(s: V): number {
  if (typeof s === "string") {
    const normalize = stripSeparators(s).valueOf();
    return isDecimal(normalize)
      ? Number.parseFloat(normalize)
      : Number.parseInt(normalize);
  }
  return s;
}

export function n<const V extends number | string>(s: V) {
  const toP = (
    typeof s === "number" ? (s.toPrecision(10) as `${typeof s}`) : s
  ) as `${V}` | Exclude<V, number>;
  return stripSeparators<typeof toP>(
    toN(toP.valueOf()).toPrecision(10) as `${V}` | Exclude<V, number>
  );
}
