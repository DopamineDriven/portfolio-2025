export const prodUrl = "https://www.asross.com" as const;

export const prevUrl = "https://dev.asross.com" as const;

export const localUrl = "http://localhost:3008" as const;

// process.env.NODE_ENV can be undefined when executing scripts programmatically pre- and/or postbuild
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
