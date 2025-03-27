/// <reference types="@edge-runtime/types" />
/// <reference types="google.analytics" />
/// <reference types="gtag.js" />

declare module "@edge-runtime/types";
declare module "google.analytics";
declare module "gtag.js";

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

export {};
