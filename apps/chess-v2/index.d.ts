/// <reference types="@edge-runtime/types" />
/// <reference types="gtag.js" />

declare module "@edge-runtime/types";
declare module "gtag.js";

declare global {
  interface Window {
    dataLayer?: object[];
  }
}

export {};
