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

  private get uiPageLayout() {
    // prettier-ignore
    return `"use client";

import type { ReactNode } from "react";
import { Footer } from "@/ui/footer";
import { Nav } from "@/ui/nav";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="@max-9xl:mx-auto flex min-h-screen flex-col justify-center">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
` as const;
  }

  private get uiNav() {
    // prettier-ignore
    return `"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Package } from "lucide-react";
import { useTheme } from "next-themes";
import { GithubIcon as Github } from "@/ui/icons/github";

const ThemeToggle = dynamic(
  () => import("@/ui/theme").then(d => d.ThemeToggle),
  { ssr: false }
);

export function Nav() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply theme based on system preference during initial load
    if (!resolvedTheme) {
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Apply theme based on resolvedTheme once it's available
      if (resolvedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [resolvedTheme]);
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 max-w-9xl sticky top-0 z-40 w-full self-center border-b backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mx-2 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Package className="size-6" />
            <span className="font-bold">turbogen</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Link
              href="https://github.com/DopamineDriven/d0paminedriven"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2">
              <Github className="size-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
              Documentation
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}` as const;
  }

  private get uiGithubIcon() {
    // prettier-ignore
    return `import type { SVGProps } from "react";

export function GithubIcon({
  ...svg
}: Omit<SVGProps<SVGSVGElement>, "xmlns" | "viewBox" | "role">) {
  return (
    <svg
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      {...svg}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        fill="currentColor"
      />
    </svg>
  );
}
` as const;
  }

  private get uiFooter() {
    // prettier-ignore
    return `"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="max-w-9xl self-center border-t py-6 md:py-0 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
          Scaffolded by &nbsp;
          <span className="font-extrabold">@d0paminedriven/turbogen</span>. The
          source code is available on&nbsp;
          <Link
            href="https://github.com/DopamineDriven/d0paminedriven"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4">
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}` as const;
  }

  private get uiTheme() {
    // prettier-ignore
    return `"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple toggle function
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // During initial load (not mounted), we'll show an icon based on a simple check
  // of the user's preferred color scheme to avoid flickering
  if (!mounted) {
    // Check if user prefers dark mode
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return (
      <Button
        variant="ghost"
        size="icon"
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "0.375rem"
        }}>
        {prefersDark ? <Moon size={20} /> : <Sun size={20} />}
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: "0",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: "0"
          }}>
          Toggle theme
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      style={{
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "0.375rem"
      }}>
      {resolvedTheme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0"
        }}>
        Toggle theme
      </span>
    </Button>
  );
}` as const;
  }

  private get uiButton() {
    return `"use client";

import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends ComponentPropsWithRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};

Button.displayName = "Button";

export { Button, buttonVariants };
` as const;
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
    "next": "latest",
    "next-themes": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwind-merge": "latest",
    "tw-animate-css": "latest"
  },
  "devDependencies": {
    "@edge-runtime/cookies": "latest",
    "@edge-runtime/types": "latest",
    "@playwright/test": "latest",
    "@${this.workspace}/eslint-config": "workspace:*",
    "@${this.workspace}/prettier-config": "workspace:*",
    "@${this.workspace}/tsconfig": "workspace:*",
    "@tailwindcss/postcss": "latest",
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
    "tailwindcss-motion": "latest",
    "tslib": "latest",
    "tsx": "latest",
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

export default {
  content: ["src/**/*.{js,ts,jsx,tsx}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    }
  }
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

  Using a data-attribute instead of a dark theme selector

*/
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@font-face {
  font-family: "CalSans";
  src: url("/fonts/CalSans-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "CalSans";
  src: url("/fonts/CalSans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@theme {
  --font-cal-sans: CalSans, sans-serif;
  --font-inter: var(--font-inter);
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

@layer components {
  .container {
    margin-inline: auto;
    @apply [padding-inline:1rem] sm:[padding-inline:2rem] lg:[padding-inline:3rem];
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
      this.calSansFont().then(() => this.calSansRegularFont());
    } catch (err) {
      console.error(err);
    } finally {
      // prettier-ignore
      return `import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/ui/page-layout";
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
  description: "@${this.workspace}/web scaffolded by @d0paminedriven/turbogen"
} satisfies Metadata;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script
          async={true}
          id="prevent-flash-of-wrong-theme"
          dangerouslySetInnerHTML={{
            __html: \`
              (function() {
                try {
                  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            \`
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background font-cal-sans min-h-screen antialiased",
          inter.variable
        )}>
        <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
          <PageLayout>{children}</PageLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
` as const;
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
    return `import { Suspense } from "react";
import { LandingPage } from "@/ui/home";

export default function HomePage() {
  return (
    <Suspense fallback={"Loading..."}>
      <LandingPage />
    </Suspense>
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

  public get uiHome() {
    // prettier-ignore
    return `"use client";

import Link from "next/link";
import { ArrowRight, Code, Layers, Package, Terminal, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/ui/button";

export function LandingPage() {
  return (
    <>
      <section className="font-cal-sans mx-auto flex justify-center space-y-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-muted rounded-2xl px-4 py-1.5 text-sm font-medium">
            Your workspace is ready
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-cal-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to your&nbsp;
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Turbo
            </span>
            &nbsp; powered workspace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            A high-performance monorepo with pnpm workspaces, powered by
            Turborepo. Pre-configured with ESLint, Prettier, TypeScript, and
            Jest.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-x-4">
            <Button asChild>
              <Link href="/docs">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="https://github.com/DopamineDriven/d0paminedriven"
                target="_blank"
                rel="noreferrer">
                GitHub
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-cal-sans text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            Everything you need to build at scale
          </h2>
          <p className="text-muted-foreground max-w-[85%] leading-normal sm:text-lg sm:leading-7">
            Turbogen provides a solid foundation for your projects with a focus
            on developer experience and performance.
          </p>
        </motion.div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-background relative overflow-hidden rounded-lg border p-6">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <Zap className="size-6 text-purple-600" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-bold">High Performance</h3>
              <p className="text-muted-foreground text-sm">
                Turborepo's intelligent caching ensures your builds are
                lightning fast.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-background relative overflow-hidden rounded-lg border p-6">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <Layers className="size-6 text-purple-600" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-bold">Monorepo Structure</h3>
              <p className="text-muted-foreground text-sm">
                Organized workspace with apps and packages for maximum code
                reuse.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-background relative overflow-hidden rounded-lg border p-6">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <Code className="size-6 text-purple-600" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-bold">Tooling Included</h3>
              <p className="text-muted-foreground text-sm">
                Pre-configured ESLint, Prettier, TypeScript, and Jest for
                consistent code quality.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-[58rem] space-y-6 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
            Ready to start building?
          </h2>
          <p className="text-muted-foreground leading-normal sm:text-lg sm:leading-7">
            Your workspace is already set up. Here's how to get started:
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-muted/50 mx-auto mt-12 max-w-[58rem] rounded-lg border p-6 md:p-8">
          <div className="flex items-center">
            <Terminal className="mr-2 size-5" />
            <h3 className="font-bold">Start developing</h3>
          </div>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-black p-4">
              <pre className="text-sm text-white">
                <code>{\`# Install dependencies
pnpm install

# Start development server
pnpm dev\`}</code>
              </pre>
            </div>
            <p className="text-muted-foreground text-sm">
              This will start the development server for your web application.
              You can now start building your project!
            </p>
          </div>
        </motion.div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24">
        <div className="bg-background mx-auto max-w-[58rem] rounded-lg border p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="bg-muted rounded-full p-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-heading text-2xl leading-[1.1]">
              Explore your workspace
            </h3>
            <p className="text-muted-foreground">
              Your monorepo is organized with the following structure:
            </p>
            <div className="bg-muted w-full max-w-md rounded-md p-4 text-left">
              <pre className="text-sm">
                <code>
                  {\`├── apps/
│   └── web/
├── packages/
│   └── ui/
└── tooling/
    ├── eslint/
    ├── prettier/
    ├── typescript/
    └── jest/\`}
                </code>
              </pre>
            </div>
            <Button asChild>
              <Link href="/docs/structure">
                Learn more about the structure&nbsp;
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}


` as const;
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
      svgWindow: this.appPath("public/window.svg"),
      uiButton: this.appPath("src/ui/button/index.tsx"),
      uiHome: this.appPath("src/ui/home/index.tsx"),
      uiTheme: this.appPath("src/ui/theme/index.tsx"),
      uiNav: this.appPath("src/ui/nav/index.tsx"),
      uiFooter: this.appPath("src/ui/footer/index.tsx"),
      uiGithubIcon: this.appPath("src/ui/icons/github.tsx"),
      uiPageLayout: this.appPath("src/ui/page-layout/index.tsx")
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
      this.writeTarget("apps/web/src/app/page.tsx", this.rootPageTsx),
      this.writeTarget("apps/web/src/ui/button/index.tsx", this.uiButton),
      this.writeTarget("apps/web/src/ui/home/index.tsx", this.uiHome),
      this.writeTarget("apps/web/src/ui/theme/index.tsx", this.uiTheme),
      this.writeTarget("apps/web/src/ui/footer/index.tsx", this.uiFooter),
      this.writeTarget("apps/web/src/ui/icons/github.tsx", this.uiGithubIcon),
      this.writeTarget("apps/web/src/ui/nav/index.tsx", this.uiNav),
      this.writeTarget(
        "apps/web/src/ui/page-layout/index.tsx",
        this.uiPageLayout
      )
    ]);
  }
}
