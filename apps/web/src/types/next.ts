export type InferGSPRTWorkup<T> =
  T extends Promise<readonly (infer U)[] | (infer U)[]> ? U : T;

export type InferGSPRT<V extends (...args: any) => any> = {
  params: Promise<InferGSPRTWorkup<ReturnType<V>>>;
};
