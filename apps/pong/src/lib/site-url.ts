export const prodUrl = "https://pong.asross.com" as const;

export const prevUrl = "https://dev.pong.asross.com" as const;

export const localUrl = "http://localhost:3011" as const;

export const envMediatedBaseUrl = (env: typeof process.env.NODE_ENV) =>
  process.env.VERCEL_ENV === "development" ||
  process.env.VERCEL_ENV === "preview"
    ? prevUrl
    : env === "development"
      ? localUrl
      : env === "production" || process.env.VERCEL_ENV === "production"
        ? prodUrl
        : env === "test"
          ? localUrl
          : prevUrl;

export const getSiteUrl = (
  env: "development" | "production" | "test" | undefined
) =>
  process.env.VERCEL_ENV === "development"
    ? prevUrl
    : !env || env === "development"
      ? localUrl
      : process.env.VERCEL_ENV
        ? process.env.VERCEL_ENV === "preview"
          ? prevUrl
          : prodUrl
        : prevUrl;
