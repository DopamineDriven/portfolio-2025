/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VERCEL_ENV: "development" | "production" | "preview";
    }
  }
}

declare module "http" {
  interface IncomingHttpHeaders {
    "x-vercel-ip-country"?: string;
    "x-vercel-ip-city"?: string;
    "x-vercel-ip-continent"?: string;
    "x-vercel-forwarded-for"?: string;
    "x-real-ip"?: string;
    "x-vercel-ip-country-region"?: string;
    "x-vercel-ip-postal-code"?: string;
    "x-vercel-signature"?: string;
    "x-vercel-ip-timezone"?: string;
    "x-vercel-ip-latitude"?: string;
    "x-vercel-ip-longitude"?: string;
  }
}

export {};
