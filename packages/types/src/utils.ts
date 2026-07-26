export type Unenumerate<T> = T extends (infer U)[] | readonly (infer U)[]
  ? U
  : T;

export type BigIntKeys<T> = {
  [K in keyof T]: T[K] extends bigint ? K : never;
}[keyof T];

export type SerializeBigInt<T, Serialized extends boolean = boolean> = {
  [K in keyof T]: T[K] extends bigint | null | undefined
    ? Serialized extends true
      ? Exclude<T[K], bigint> | number
      : T[K]
    : T[K];
};

export type NormalizeAndInject<V, Q = object, P extends boolean = boolean> = DX<
  SerializeBigInt<V, P> & Q
>;

/**
 * Superior form of Omit
 */
export type Rm<T, P extends keyof T = keyof T> = {
  [S in keyof T as Exclude<S, P>]: T[S];
};

/**
 * helper workup for use in XOR type below
 * makes properties from U optional and undefined in T, and vice versa
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type Include<T, U extends T> = Exclude<T, Exclude<T, U>>;

/**
 * enforces mutual exclusivity of T | U
 */
// prettier-ignore
export type XOR<T, U> =
  [T, U] extends [object, object]
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U

/**
 * CTR (Conditional to Required)
 *
 * - By default: makes all **optional** properties required.
 * - With K: makes only the specified optional keys required.
 */
export type CTR<
  T,
  K extends keyof OnlyOptional<T> = keyof OnlyOptional<T>
> = Rm<T, K> & {
  [Q in K]-?: T[Q];
};

/**
 * RTC (Required to Conditional)
 *
 * - By default: makes all **required** properties optional.
 * - With K: makes only the specified required keys optional.
 */
export type RTC<
  T,
  K extends keyof OnlyRequired<T> = keyof OnlyRequired<T>
> = Rm<T, K> & {
  [Q in K]?: T[Q];
};
export type IsExact<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

export type UTR<
  TUnion extends Record<TKey, string>,
  TKey extends string = "kind",
  TDiscriminant extends string = TUnion[TKey]
> = {
  [K in TDiscriminant]: Extract<TUnion, Record<TKey, K>>;
};

/**
 * TCN (To Conditionally Never)
 */
export type TCN<T, X extends keyof T = keyof T> = Rm<T, X> & {
  [Q in X]?: XOR<T[Q], never>;
};

export type ArrFieldReplacer<
  T extends unknown[] | readonly unknown[],
  V extends keyof Unenumerate<T>,
  Q extends boolean = false,
  P = unknown
> = T extends (infer U)[] | readonly (infer U)[]
  ? V extends keyof U
    ? Q extends true
      ? P extends Record<infer Y, infer X>
        ? (Rm<U, V> & Record<Y, X>)[]
        : (Rm<U, V> & P)[]
      : Q extends false
        ? Rm<U, V>[]
        : U
    : T
  : T;

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

/**
 * workup for next.js dynamic route generate static params handling
 */
export type InferGSPRTWorkup<T> =
  T extends Promise<readonly (infer U)[] | (infer U)[]> ? U : T;

/**
 * infer generate static params return type in next.js dynamic routes
 */
export type InferGSPRT<V extends (...args: any) => any> = {
  params: Promise<InferGSPRTWorkup<ReturnType<V>>>;
};

/**
 * Expect that the thing passed to Expect<T> is true.
 *
 * For instance, `Expect<true>` won't error. But
 * `Expect<false>` will error.
 */
export type Expect<T extends true> = T;

/**
 * Checks that X and Y are exactly equal.
 *
 * For instance, `Equal<'a', 'a'>` is true. But
 * `Equal<'a', 'b'>` is false.
 *
 * This also checks for exact intersection equality. So
 * `Equal<{ a: string; b: string  }, { a: string; b: string }>`
 * is true. But `Equal<{ a: string; b: string  }, { a: string; } & { b: string }>`
 * is false.
 */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

/**
 * Checks that Y is assignable to X.
 *
 * For instance, `Extends<string, 'a'>` is true. This is because
 * 'a' can be passed to a function which expects a string.
 *
 * But `Extends<'a', string>` is false. This is because a string
 * CANNOT be passed to a function which expects 'a'.
 */
export type Extends<X, Y> = Y extends X ? true : false;

export type DX<Y> = {
  [P in keyof Y]: Y[P];
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DeepPartialFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: DeepPartial<T[P]>;
};

// Recursive type replacement
export type DeepReplace<T, From, To> = T extends From
  ? To
  : T extends object
    ? { [K in keyof T]: DeepReplace<T[K], From, To> }
    : T;

// Make certain nested fields required
export type RequireNested<
  T,
  Path extends string
> = Path extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rm<T, K> & Record<K, RequireNested<Required<T>[K], Rest>>
    : T
  : Path extends keyof T
    ? Rm<T, Path> & Record<Path, Required<T>[Path]>
    : T;

export type FlexiCase<T extends string> = Lowercase<T> | Uppercase<T>;

export function createDraftId(
  userId: string,
  conversationId: string,
  batchId: string,
  ordinal: number
) {
  if (!Number.isInteger(ordinal) || ordinal < 0) {
    throw new Error("ordinal must be a non-negative integer");
  }
  if (
    ![userId, conversationId, batchId].every(s => /^[A-Za-z0-9_-]+$/.test(s))
  ) {
    throw new Error("ids must be [A-Za-z0-9_-]+");
  }
  return `${userId}~${conversationId}~${batchId}~${ordinal}` as const;
}
/**
 * returns `[string, string, string, number]`
 *
 * corresponds to `[userId, conversationId, batchId, ordinal (asset count)]`
 *
 * which is the anatomy of an asset draftId
 */
export function parseDraftId(draftId: string) {
  if (/^(?:[A-Za-z0-9_-]+~){3}(?:0|[1-9][0-9]*)$/.test(draftId) === false) {
    throw new Error(`invalid draftId ${draftId}`);
  }
  const toArr = draftId.split("~");

  return toArr.map((v, o) =>
    o !== toArr.length - 1 ? v : Number.parseInt(v, 10)
  ) as [string, string, string, number];
}

export function instanceFunc<const Type>(c: new (...args: Type[]) => Type) {
  return new c();
}

export type CommonDiscriminants =
  "type" | "kind" | "event" | "tag" | "provider" | "_tag" | "__typename";

export type LiteralUnion<TKnown extends string> = TKnown | string;

export type DiscriminatedUnionToRecord<
  TUnion extends Record<TKey, string>,
  TKey extends LiteralUnion<CommonDiscriminants> =
    LiteralUnion<CommonDiscriminants>
> = TKey extends keyof TUnion
  ? { [K in TUnion[TKey] & string]: Extract<TUnion, Record<TKey, K>> }
  : never;

export type UnionToRecord<
  TUnion extends Record<"type", string>,
  TDiscriminant extends string = TUnion["type"]
> = {
  [K in TDiscriminant]: Extract<TUnion, { type: K }>;
};
export type Signals =
  | "SIGABRT"
  | "SIGALRM"
  | "SIGBREAK"
  | "SIGBUS"
  | "SIGCHLD"
  | "SIGCONT"
  | "SIGFPE"
  | "SIGHUP"
  | "SIGILL"
  | "SIGINFO"
  | "SIGINT"
  | "SIGIO"
  | "SIGIOT"
  | "SIGKILL"
  | "SIGLOST"
  | "SIGPIPE"
  | "SIGPOLL"
  | "SIGPROF"
  | "SIGPWR"
  | "SIGQUIT"
  | "SIGSEGV"
  | "SIGSTKFLT"
  | "SIGSTOP"
  | "SIGSYS"
  | "SIGTERM"
  | "SIGTRAP"
  | "SIGTSTP"
  | "SIGTTIN"
  | "SIGTTOU"
  | "SIGUNUSED"
  | "SIGURG"
  | "SIGUSR1"
  | "SIGUSR2"
  | "SIGVTALRM"
  | "SIGWINCH"
  | "SIGXCPU"
  | "SIGXFSZ";

/**
 * retained to support repos still using it
 */
export type BigIntOrNumber<T extends boolean = false> = T extends true
  ? number
  : bigint;

// export type FilterBySelect<Q extends keyof ModelIdToModelDisplayName> = Exclude<
//   Exclude<Q, ProductDataFull>,
//   ProductDataFull
// >;

// export type FilterResults<S extends keyof ProductDataFull> = Rm<
//   ProductDataFull,
//   Exclude<keyof ProductDataFull, FilterBySelect<S>>
// >;
/**
 *
 */
