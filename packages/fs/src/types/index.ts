import type { WithImplicitCoercion } from "buffer";

export type BufferEncodingUnion =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "base64url"
  | "latin1"
  | "binary"
  | "hex"
  | "utf-16le";

export interface Dict<T> {
  [key: string]: T | undefined;
}

export interface ProcessEnv extends Dict<string> {
  readonly VERCEL_ENV: typeof process.env.VERCEL_ENV;
  readonly NODE_ENV: typeof process.env.NODE_ENV;
  /**
   * Can be used to change the default timezone at runtime
   */
  TZ?: string;
}

export interface ProcessEnvOptions {
  uid?: number | undefined;
  gid?: number | undefined;
  cwd?: string | URL | undefined;
  env?: ProcessEnv | undefined;
}

export interface CommonOptions extends ProcessEnvOptions {
  /**
   * @default false
   */
  windowsHide?: boolean | undefined;
  /**
   * @default 0
   */
  timeout?: number | undefined;
}

export type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigUint64Array
  | BigInt64Array
  | Float32Array
  | Float64Array;

export type Signals =
  | "SIGABRT"
  | "SIGALRM"
  | "SIGBUS"
  | "SIGCHLD"
  | "SIGCONT"
  | "SIGFPE"
  | "SIGHUP"
  | "SIGILL"
  | "SIGINT"
  | "SIGIO"
  | "SIGIOT"
  | "SIGKILL"
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
  | "SIGXFSZ"
  | "SIGBREAK"
  | "SIGLOST"
  | "SIGINFO";

export type ArrayBufferView = DataView | TypedArray;

export type IOType = "overlapped" | "pipe" | "ignore" | "inherit";

export type StdioOptions =
  | IOType
  | (IOType | "ipc" | import("stream").Stream | number | null | undefined)[];

export interface CommonExecOptions extends CommonOptions {
  input?: string | ArrayBufferView | undefined;
  /**
   * Can be set to 'pipe', 'inherit, or 'ignore', or an array of these strings.
   * If passed as an array, the first element is used for `stdin`, the second for
   * `stdout`, and the third for `stderr`. A fourth element can be used to
   * specify the `stdio` behavior beyond the standard streams.
   *
   * @default 'pipe'
   */
  stdio?: StdioOptions | undefined;
  killSignal?: Signals | number | undefined;
  maxBuffer?: number | undefined;
  encoding?: BufferEncoding | "buffer" | null | undefined;
}

export interface ExecSyncOptions extends CommonExecOptions {
  shell?: string | undefined;
}
export interface ExecSyncOptionsWithStringEncoding extends ExecSyncOptions {
  encoding: BufferEncoding;
}
export interface ExecSyncOptionsWithBufferEncoding extends ExecSyncOptions {
  encoding?: "buffer" | null | undefined;
}

export interface ObjEncodingOptions {
  encoding?: BufferEncodingUnion | null | undefined;
}
export type OpenMode = string | number;

export interface Abortable {
  /**
   * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
   */
  signal?: AbortSignal | undefined;
}

export type Mode = string | number;

export interface MkDirOptions {
  /**
   * Indicates whether parent folders should be created.
   * If a folder was created, the path to the first created folder will be returned.
   * @default false
   */
  recursive?: boolean | undefined;
  /**
   * A file mode. If a string is passed, it is parsed as an octal integer. If not specified
   * @default 0o777
   */
  mode?: Mode | undefined;
}

export type BashEnv = "development" | "production" | "test" | undefined;

export type CoercionUnion = string | Uint8Array | readonly number[];

export type WriteStreamDataShape = WithImplicitCoercion<CoercionUnion> | CoercionUnion;

export type WriteStreamProps<T extends string = string> = {
  data: WithImplicitCoercion<CoercionUnion>;
  cwd: string;
  path: T;
};

export type WriteStreamOptions =
  | BufferEncodingUnion
  | {
      encoding?: BufferEncodingUnion;
      autoClose?: boolean;
      emitClose?: boolean;
      start?: number;
      highWaterMark?: number;
      flush?: boolean;
    };

export type WriteFileAsyncDataUnion =
  | WithImplicitCoercion<string>
  | { [Symbol.toPrimitive](hint: "string"): string };

export type ReadDirOptions =
  | BufferEncodingUnion
  | (
      | (ObjEncodingOptions & {
          withFileTypes?: false | undefined;
          recursive?: boolean | undefined;
        })
      | null
    );

export type WriteFileAsyncOptions =
  | (ObjEncodingOptions & {
      mode?: Mode | undefined;
      flag?: OpenMode | undefined;
    } & Abortable)
  | BufferEncodingUnion
  | null;

export type WriteFileAsyncProps<T extends string = string> = {
  path: T;
  cwd: string;
  data: WriteFileAsyncDataUnion;
  options?:
    | (ObjEncodingOptions & {
        mode?: Mode | undefined;
        flag?: OpenMode | undefined;
      } & Abortable)
    | BufferEncodingUnion
    | null;
};

export type ReadDirProps<T extends string> = {
  path: T;
  options?: ReadDirOptions;
};

export type MkDirSyncOptions =
  | Mode
  | (MkDirOptions & {
      recursive?: boolean | undefined;
    })
  | null
  | undefined;

export type MkDirSyncProps<T extends string> = {
  cwd: string;
  path: T;
  options?:
    | Mode
    | (MkDirOptions & { recursive?: boolean | undefined })
    | null
    | undefined;
};

export interface ExecuteCommandProps<T extends string>
  extends ExecSyncOptionsWithBufferEncoding {
  command: T;
}

export type ConditionalPromise<T> = T | Promise<T>;

export type UnwrapPromise<T> = T extends Promise<infer U> | PromiseLike<infer U>
  ? U
  : T;

export type RemoveFields<T, P extends keyof T = keyof T> = {
  [S in keyof T as Exclude<S, P>]: T[S];
};

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

export type ArrayOrReadOnlyArray<T> = T[] | readonly T[];

export type Unenumerate<T> = T extends readonly (infer U)[] | (infer U)[]
  ? U
  : T;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type Depth<
  Y extends { [record: string | symbol | number]: unknown },
  X extends keyof Y = keyof Y
> = {
  [H in keyof Y[X]]: Y[X][H][keyof Y[X][H]];
};

export type InferDepth<T> = T extends Depth<infer U, infer X> ? U[X] : T;

export type OmitSrc<T> = T extends `src/${infer U}` ? U : T;

export type InjectScriptsProps<T> = {
  content: {
    scripts: {
      [record: string]: string;
    };
  } & {
    [record: string]:
      | string
      | number
      | boolean
      | {
          [record: string]: string;
        };
  };
  tuplesToInject: T;
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

export type ParsedUrlInfo = {
  href: string;
  protocol: string;
  baseUrl: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
};
