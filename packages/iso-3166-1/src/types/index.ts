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
