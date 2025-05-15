import { ConfigHandler } from "@/config/index.js";
import { PromptPropsBase } from "@/types/index.js";

/* eslint-disable no-useless-escape */

export class WebAppScaffolder extends ConfigHandler {
  constructor(
    public override cwd: string,
    public baseProps: PromptPropsBase
  ) {
    super((cwd ??= process.cwd()));
  }

  private get workspace() {
    return this.baseProps.workspace;
  }

  private get port() {
    return this.baseProps.port;
  }

  private get turboJson() {
    // prettier-ignore
    return `{
  "$schema": "https://turborepo.org/schema.json",
  "extends": ["//"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "next-env.d.ts"]
    },
    "dev": {
      "persistent": true
    }
  }
}` as const;
  }

  private get globalDts() {
    // prettier-ignore
    return `/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VERCEL_ENV: "development" | "production" | "preview";
    }
  }
}

export {};
` as const;
  }

  private get indexDts() {
    // prettier-ignore
    return `/// <reference types="@edge-runtime/types" />
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
` as const;
  }

  private get eslintConfigMjs() {
    // prettier-ignore
    return `import baseConfig from "@${this.workspace}/eslint-config/base";
import nextjsConfig from "@${this.workspace}/eslint-config/next";
import reactConfig from "@${this.workspace}/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  {
    ignores: [".next/**", "!.next/types/**/*"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/require-await": "off",
      "import/consistent-type-specifier-style": "off"
    }
  }
];` as const;
  }

  private get postcssConfigMjs() {
    // prettier-ignore
    return `/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};` as const;
  }

  private get nextEnvDts() {
    // prettier-ignore
    return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.` as const;
  }

  private get tsconfigJson() {
    // prettier-ignore
    return `{
  "extends": "@${this.workspace}/tsconfig/next.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ],
    "tsBuildInfoFile": "node_modules/.cache/tsbuildinfo.json"
  },
  "include": [
    ".",
    "next-env.d.ts",
    "next.config.ts",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "src/**/*.tsx",
    "src/**/*.ts",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules", "public/**/*.js"]
}` as const;
  }

  private get pkgJsonTemplate() {
    // prettier-ignore
    return `{
  "name": "@${this.workspace}/web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "prettier": "@${this.workspace}/prettier-config",
  "scripts": {
    "dev": "next dev -p ${this.port} --turbo",
    "build": "next build",
    "format": "prettier --write \\"**/*.{ts,tsx,cts,mts,js,jsx,mjs,cjs,json,yaml,yml,css,html,md,mdx,graphql,gql}\\" --ignore-unknown --cache",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    "motion": "latest",
    "nanoid": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-wrap-balancer": "latest",
    "suspend-react": "latest",
    "swr": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@edge-runtime/cookies": "latest",
    "@edge-runtime/types": "latest",
    "@playwright/test": "latest",
    "@${this.workspace}/eslint-config": "workspace:*",
    "@${this.workspace}/prettier-config": "workspace:*",
    "@${this.workspace}/tsconfig": "workspace:*",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@vercel/functions": "latest",
    "autoprefixer": "latest",
    "csstype": "latest",
    "dotenv": "latest",
    "dotenv-cli": "latest",
    "dotenv-expand": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "motion-dom": "latest",
    "motion-utils": "latest",
    "postcss": "latest",
    "prettier": "latest",
    "sharp": "latest",
    "tailwindcss": "latest",
    "tailwindcss-animate": "latest",
    "tailwindcss-motion": "latest",
    "tslib": "latest",
    "tsx": "latest",
    "tw-animate-css": "latest",
    "typescript": "latest",
    "urlpattern-polyfill": "latest",
    "webpack": "latest"
  }
}
` as const;
  }

  private get nextConfigTemplate() {
    // prettier-ignore
    return `import type { NextConfig } from "next";

export default {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false, tsconfigPath: "./tsconfig.json" },
  images: {
    loader: "default",
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "localhost",
        port: "${this.port}",
        protocol: "http"
      },
      { hostname: "images.unsplash.com", protocol: "https" },
      { hostname: "tailwindui.com", protocol: "https" }
    ]
  },
  productionBrowserSourceMaps: true
} satisfies NextConfig;` as const;
  }

  private get tailwindTemplate() {
    // prettier-ignore
    return `import type { Config as TailwindConfig } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  content: ["src/**/*.{js,ts,jsx,tsx}"],
  future: { hoverOnlyWhenSupported: true }
} satisfies TailwindConfig;` as const;
  }

  private get globalCss() {
    // prettier-ignore
    return `@import "tailwindcss";
@import "tw-animate-css";

@config "../../tailwind.config.ts";
@plugin "tailwindcss-motion";

/*
  https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually

  Uncomment the following to use a CSS Selector instead of the \`prefers-color-scheme\` media-query

  @custom-variant dark (&:where(.dark, .dark *));
*/

/*
  https://tailwindcss.com/docs/dark-mode#using-a-data-attribute

  Uncomment the following to use a data-attribute instead of a dark theme selector

  @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
*/

@font-face {
  font-family: "CalSans";
  src: url("/fonts/CalSans-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}


@theme {
  --font-cal-sans-semi-bold: CalSans, sans-serif;
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.14 0.0044 285.82);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.14 0.0044 285.82);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.14 0.0044 285.82);
  --color-primary: oklch(0.21 0.0059 285.88);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-secondary: oklch(0.97 0.0013 286.38);
  --color-secondary-foreground: oklch(0.21 0.0059 285.88);
  --color-muted: oklch(0.97 0.0013 286.38);
  --color-muted-foreground: oklch(0.55 0.0137 285.94);
  --color-accent: oklch(0.97 0.0013 286.38);
  --color-accent-foreground: oklch(0.21 0.0059 285.88);
  --color-destructive: oklch(0.64 0.2078 25.33);
  --color-destructive-foreground: oklch(0.98 0 0);
  --color-border: oklch(0.92 0.004 286.32);
  --color-input: oklch(0.92 0.004 286.32);
  --color-ring: oklch(0.21 0.0059 285.88);
  --color-chart-1: oklch(0.546 0.2153 262.87);
  --color-chart-2: oklch(0.5409 0.2468 292.95);
  --color-chart-3: oklch(0.6624 0.2895 320.92);
  --color-chart-4: oklch(0.6924 0.1426 165.69);
  --color-chart-5: oklch(0.8372 0.1644 84.53);
  --color-hue-0: oklch(0.9434 0.199 105.96);
  --color-hue-1: oklch(0.6477 0.263 359.98);
  --color-hue-2: oklch(0.6404 0.300 324.36);
  --color-hue-3: oklch(0.5636 0.292 301.63);
  --color-hue-4: oklch(0.5898 0.211 259.36);
  --color-hue-5: oklch(0.8203 0.141 210.49);
  --color-hue-6: oklch(0.8842 0.107 168.47);

  --radius-sm: 0.25rem;

  --container-8xl: 96rem;
  --container-9xl: 120rem;
  --container-10xl: 173.75rem;

  --spacing-8xl: 96rem;
  --spacing-9xl: 120rem;
  --spacing-10xl: 173.75rem;

  --perspective-1000: 1000px;

  --text-sxs: 0.625rem;
  --text-sxs--line-height: calc(0.875 / 0.625);
  --text-xxs: 0.5rem;
  --text-xxs--line-height: calc(0.75 / 0.5);

  --animate-shimmer: shimmer 3s cubic-bezier(0.4, 0.7, 0.6, 1) infinite;
  @keyframes shimmer {
    0% {
      opacity: 0.5;
    } /* Start with a semi-transparent state */
    50% {
      opacity: 1;
    } /* Become fully visible */
    100% {
      opacity: 0.5;
    } /* Return to semi-transparent */
  }

  --animate-brushed-metal: brushed-metal-shift 8s linear infinite alternate;
  @keyframes brushed-metal-shift {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 100% center;
    }
  }

  --animate-cursor-blink: cursor-blink 0.7s step-end infinite;
  @keyframes cursor-blink {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  --animate-twinkle: twinkle 5s infinite;
  @keyframes twinkle {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
  }

  --animate-cursor-advance: cursor-advance 0.1s linear;
  @keyframes cursor-advance {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }

  --animate-carousel: carousel-scroll 60s linear infinite;
  @keyframes carousel-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}

@layer theme {
  .dark {
    --color-background: oklch(0.14 0.0044 285.82);
    --color-foreground: oklch(0.98 0 0);
    --color-card: oklch(0.14 0.0044 285.82);
    --color-card-foreground: oklch(0.98 0 0);
    --color-popover: oklch(0.14 0.0044 285.82);
    --color-popover-foreground: oklch(0.98 0 0);
    --color-primary: oklch(0.98 0 0);
    --color-primary-foreground: oklch(0.21 0.0059 285.88);
    --color-secondary: oklch(0.27 0.0055 286.03);
    --color-secondary-foreground: oklch(0.98 0 0);
    --color-muted: oklch(0.27 0.0055 286.03);
    --color-muted-foreground: oklch(0.71 0.0129 286.07);
    --color-accent: oklch(0.27 0.0055 286.03);
    --color-accent-foreground: oklch(0.98 0 0);
    --color-destructive: oklch(0.4 0.1331 25.72);
    --color-destructive-foreground: oklch(0.98 0 0);
    --color-border: oklch(0.27 0.0055 286.03);
    --color-input: oklch(0.27 0.0055 286.03);
    --color-ring: oklch(0.87 0.0055 286.29);
    --color-chart-1: oklch(0.546 0.2153 262.87);
    --color-chart-2: oklch(0.5409 0.2468 292.95);
    --color-chart-3: oklch(0.6624 0.2895 320.92);
    --color-chart-4: oklch(0.6924 0.1426 165.69);
    --color-chart-5: oklch(0.8372 0.1644 84.53);
    --color-hue-0: oklch(0.9434 0.199 105.96);
    --color-hue-1: oklch(0.6477 0.263 359.98);
    --color-hue-2: oklch(0.6404 0.300 324.36);
    --color-hue-3: oklch(0.5636 0.292 301.63);
    --color-hue-4: oklch(0.5898 0.211 259.36);
    --color-hue-5: oklch(0.8203 0.141 210.49);
    --color-hue-6: oklch(0.8842 0.107 168.47);
  }
}


/*
  The default border color has changed to \`currentColor\` in Tailwind CSS v4,
  so we've added these compatibility styles to make sure everything still
  looks the same as it did with Tailwind CSS v3.

  If we ever want to remove these styles, we need to add an explicit border
  color utility to any element that depends on these defaults.
*/

:root {
  --radius: 0.5rem;
}

@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
  * {
    border-color: var(--color-border);
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}

@supports not (backdrop-filter: blur(4px)) {
  .backdrop-blur-sm {
    background-color: color-mix(
      in oklab,
      var(--color-background) 90%,
      transparent
    );
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
textarea,
select {
  font: inherit;
}

body {
  overflow-x: hidden;
}
` as const;
  }

  private get globalErrorTsx() {
    // prettier-ignore
    return `"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
        <details className='[&_details[open]]:p-2 [&_details[open]_summary]:mb-2 [&_details[open]_summary]:border-b [&_details[open]_summary]:border-solid [&_details[open]_summary]:border-[#aaa]'>
          <summary className='-my-2 mx-0 p-2 font-sans'>
            Details
          </summary>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </details>
      </body>
    </html>
  );
}` as const;
  }

  private get rootLayoutTsx() {
    try {
      this.calSansFont();
    } catch (err) {
      console.error(err);
    } finally {
      // prettier-ignore
      return `import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
/* populate relevant values in src/lib/site-url.ts and uncomment for url injetion */
// import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"]
});

export const viewport = {
  colorScheme: "normal",
  userScalable: true,
  themeColor: "#ffffff",
  viewportFit: "auto",
  initialScale: 1,
  maximumScale: 1,
  width: "device-width"
} satisfies Viewport;

export const metadata = {
  /* populate relevant values in src/lib/site-url.ts and uncomment for url injetion */
  // metadataBase: new URL(getSiteUrl(process.env.NODE_ENV)),
  title: {
    default: "@${this.workspace}/web",
    template: "%s | @${this.workspace}/web"
  },
  description: "@${this.workspace}/web created by @d0paminedriven/turbogen"
} satisfies Metadata;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        suppressHydrationWarning
        lang='en' className={inter.variable}>
        <body className={"antialiased"}>
          {children}
        </body>
      </html>
  );
}` as const;
    }
  }

  private get libCnTs() {
    // prettier-ignore
    return `import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
` as const;
  }

  private get libSiteUrlTs() {
    // prettier-ignore
    return `export const getProductionUrl = "https://prod-placeholder.com" as const;

export const getPreviewUrl = "https://preview-placeholder.vercel.app" as const;

export const getLocalUrl = "http://localhost:${this.port}" as const;

export const envMediatedBaseUrl = (env: typeof process.env.NODE_ENV) =>
  process.env.VERCEL_ENV === "development" ||
  process.env.VERCEL_ENV === "preview"
    ? getPreviewUrl
    : env === "development"
      ? getLocalUrl
      : env === "production" || process.env.VERCEL_ENV === "production"
        ? getProductionUrl
        : env === "test"
          ? getLocalUrl
          : getPreviewUrl;

export const getSiteUrl = (
  env: "development" | "production" | "test" | undefined
) =>
  process.env.VERCEL_ENV === "development"
    ? getPreviewUrl
    : !env || env === "development"
      ? getLocalUrl
      : process.env.VERCEL_ENV
        ? process.env.VERCEL_ENV === "preview"
          ? getPreviewUrl
          : getProductionUrl
        : getPreviewUrl;` as const;
  }

  private get libBase64Ts() {
    // prettier-ignore
    return `export function toBase64<const T extends string>(str: T) {
  return typeof window === "undefined"
    ? Buffer.from(str, "utf-8").toString("base64")
    : window.btoa(str);
}

export function fromBase64<const T extends string>(str: T) {
  typeof window === "undefined"
    ? Buffer.from(str, "base64").toString("utf-8")
    : window.atob(str);
}
` as const;
  }

  private get libSafeNumberTs() {
    // prettier-ignore
    return `export function isDecimal<const T extends number | \`\${number}\`>(s: T) {
  if (typeof s === "number") {
    return /\./.test(s.toString(10));
  } else return /\./.test(s);
}

export function toN<const V extends number | \`\${number}\`>(s: V) {
  return typeof s === "string"
    ? isDecimal(s) === true
      ? Number.parseFloat(s)
      : Number.parseInt(s, 10)
    : s;
}
` as const;
  }

  private get libShimmerTs() {
    // prettier-ignore
    return `import { toBase64 } from "@/lib/base64";
import { toN as n } from "@/lib/safe-number";

export type SafeNumber = \`\${number}\` | number;

export function shimmerScaffold<
  const W extends SafeNumber,
  const H extends SafeNumber
>({ w, h }: { w: W; h: H }) {
  // prettier-ignore
  return \`<svg width="\${n(w)}" height="\${n(h)}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="\${n(w)}" height="\${n(h)}" fill="#333" />
  <rect id="r" width="\${n(w)}" height="\${n(h)}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-\${n(w)}" to="\${n(w)}" dur="1s" repeatCount="indefinite"  />
</svg>\`;
}

/**
 * use in the "blurDataUrl" property of the Nextjs Image component and set the "placeholder" property to "blur"
 */
export function shimmer<
  const W extends SafeNumber,
  const H extends SafeNumber
>([w, h]: [W, H]) {
  return \`data:image/svg+xml;base64,\${toBase64(shimmerScaffold({ w, h }))}\` as const;
}
` as const;
  }

  private get typeNextTs() {
    // prettier-ignore
    return `export type InferGSPRTWorkup<T> =
  T extends Promise<readonly (infer U)[] | (infer U)[]> ? U : T;

/**
 * usage with dynamic page routes in nextjs app directory for a [slug] route
 *
 * \`\`\`tsx
  export default async function DynamicPage({
    params
  }: InferGSPRT<typeof generateStaticParams>) {
    const { slug } = await params;
    // your code here
  }
  \`\`\`
*/

export type InferGSPRT<V extends (...args: any) => any> = {
  params: Promise<InferGSPRTWorkup<ReturnType<V>>>;
};` as const;
  }

  private get typeHelpersTs() {
    // prettier-ignore
    return `import type React from "react";

/* General Helper Types BEGIN */

export type Unenumerate<T> = T extends readonly (infer U)[] | (infer U)[]
  ? U
  : T;

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

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

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

export type FilterOptionalOrRequired<
  V,
  T extends "conditional" | "required"
> = T extends "conditional" ? OnlyOptional<V> : OnlyRequired<V>;



/* General Helper Types END */


/* Case helper types BEGIN  */


/** Convert literal string types like 'foo-bar' to 'FooBar' */
export type ToPascalCase<S extends string> = string extends S
  ? string
  : S extends \`\${infer T}-\${infer U}\`
    ? \`\${Capitalize<T>}\${ToPascalCase<U>}\`
    : Capitalize<S>;

/** Convert literal string types like 'foo-bar' to 'fooBar' */
export type ToCamelCase<S extends string> = string extends S
  ? string
  : S extends \`\${infer T}-\${infer U}\`
    ? \`\${T}\${ToPascalCase<U>}\`
    : S;


/* Case helper types END  */


/* Helper functions BEGIN */

export function whAdjust<O extends string, T extends number>(
  ogVal: O,
  widthOrHeight?: string | number,
  relAdjust?: T
) {
  return widthOrHeight && relAdjust
    ? typeof widthOrHeight === "string"
      ? Number.parseInt(widthOrHeight, 10) * relAdjust
      : widthOrHeight * relAdjust
    : ogVal;
}

/* Helper functions END */
` as const;
  }

  private get rootPageTsx() {
    // prettier-ignore
    return `import Image from "next/image";
import { shimmer } from "@/lib/shimmer";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-geist-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          placeholder="blur"
          blurDataURL={shimmer([180,38])}
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-geist-mono">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              placeholder="blur"
              blurDataURL={shimmer([20,20])}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            placeholder="blur"
            blurDataURL={shimmer([16,16])}
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            placeholder="blur"
            blurDataURL={shimmer([16,16])}
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            placeholder="blur"
            blurDataURL={shimmer([16,16])}
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}` as const;
  }

  public get svgFile() {
    // prettier-ignore
    return `<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
    clip-rule="evenodd" fill="#666" fill-rule="evenodd" />
</svg>
` as const
  }

  public get svgGlobe() {
    // prettier-ignore
    return `<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <g clip-path="url(#a)">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1"
      fill="#666" />
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h16v16H0z" />
    </clipPath>
  </defs>
</svg>
` as const
  }

  public get svgNext() {
    // prettier-ignore
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80">
  <path fill="#000"
    d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z" />
  <path fill="#000"
    d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z" />
</svg>
` as const
  }

  public get svgVercel() {
    // prettier-ignore
    return `<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000">
  <path d="m577.3 0 577.4 1000H0z" fill="#fff" />
</svg>

` as const
  }

  public get svgWindow() {
    // prettier-ignore
    return `<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" clip-rule="evenodd"
    d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
    fill="#666" />
</svg>
` as const
  }

  private appPath<const F extends string>(file: F) {
    return `apps/web/${file}` as const;
  }

  private get getPaths() {
    return {
      index: this.appPath("turbo.json"),
      packageJson: this.appPath("package.json"),
      eslint: this.appPath("eslint.config.mjs"),
      postcss: this.appPath("postcss.config.mjs"),
      nextconfig: this.appPath("next.config.ts"),
      tailwind: this.appPath("tailwind.config.ts"),
      tsconfig: this.appPath("tsconfig.json"),
      nextenvdts: this.appPath("next-env.d.ts"),
      globaldts: this.appPath("global.d.ts"),
      globalCss: this.appPath("src/app/globals.css"),
      rootlayout: this.appPath("src/app/layout.tsx"),
      rootpage: this.appPath("src/app/page.tsx"),
      globalerror: this.appPath("src/app/global-error.tsx"),
      libCn: this.appPath("src/lib/utils.ts"),
      libSiteUrl: this.appPath("src/lib/site-url.ts"),
      libBase64: this.appPath("src/lib/base64.ts"),
      libSafeNumber: this.appPath("src/lib/safe-number.ts"),
      libShimmer: this.appPath("src/lib/shimmer.ts"),
      typeHelpers: this.appPath("src/types/helpers.ts"),
      typeNext: this.appPath("src/types/next.ts"),
      svgFile: this.appPath("public/file.svg"),
      svgGlobe: this.appPath("public/globe.svg"),
      svgNext: this.appPath("public/next.svg"),
      svgVercel: this.appPath("public/vercel.svg"),
      svgWindow: this.appPath("public/window.svg")
    } as const;
  }

  private appTarget<const V extends keyof typeof this.getPaths>(target: V) {
    return this.getPaths[target];
  }

  private writeTarget<
    const T extends ReturnType<typeof this.appTarget>,
    const V extends string
  >(target: T, template: V) {
    return this.withWs(target, template);
  }

  public exeWebApp() {
    return Promise.all([
      this.writeTarget("apps/web/turbo.json", this.turboJson),
      this.writeTarget("apps/web/next.config.ts", this.nextConfigTemplate),
      this.writeTarget("apps/web/package.json", this.pkgJsonTemplate),
      this.writeTarget("apps/web/tailwind.config.ts", this.tailwindTemplate),
      this.writeTarget("apps/web/tsconfig.json", this.tsconfigJson),
      this.writeTarget("apps/web/global.d.ts", this.globalDts),
      this.writeTarget("apps/web/next-env.d.ts", this.nextEnvDts),
      this.writeTarget("apps/web/eslint.config.mjs", this.eslintConfigMjs),
      this.writeTarget("apps/web/postcss.config.mjs", this.postcssConfigMjs),
      this.writeTarget(
        "apps/web/src/app/global-error.tsx",
        this.globalErrorTsx
      ),
      this.writeTarget("apps/web/src/app/globals.css", this.globalCss),
      this.writeTarget("apps/web/src/app/layout.tsx", this.rootLayoutTsx),
      this.writeTarget("apps/web/src/lib/utils.ts", this.libCnTs),
      this.writeTarget("apps/web/src/lib/site-url.ts", this.libSiteUrlTs),
      this.writeTarget("apps/web/src/lib/base64.ts", this.libBase64Ts),
      this.writeTarget("apps/web/src/lib/safe-number.ts", this.libSafeNumberTs),
      this.writeTarget("apps/web/src/lib/shimmer.ts", this.libShimmerTs),
      this.writeTarget("apps/web/src/types/next.ts", this.typeNextTs),
      this.writeTarget("apps/web/src/types/helpers.ts", this.typeHelpersTs),
      this.writeTarget("apps/web/public/file.svg", this.svgFile),
      this.writeTarget("apps/web/public/next.svg", this.svgNext),
      this.writeTarget("apps/web/public/globe.svg", this.svgGlobe),
      this.writeTarget("apps/web/public/vercel.svg", this.svgVercel),
      this.writeTarget("apps/web/public/window.svg", this.svgWindow),
      this.writeTarget("apps/web/src/app/page.tsx", this.rootPageTsx)
    ]);
  }
}
