import { resolve } from "node:path";
import type { ViteUserConfigExport } from "vitest/config";
import reactPlugin from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export const sharedConfig = (cwd = process.cwd()) =>
  defineConfig({
    plugins: [reactPlugin({ include: /\.spec\.tsx?$/ })],
    root: cwd,
    resolve: {
      alias: {
        "@": resolve(cwd, "./src")
      }
    },
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        provider: "istanbul",
        reporter: [
          [
            "json",
            {
              file: `../coverage.json`
            }
          ]
        ],
        enabled: true
      }
    }
  } satisfies ViteUserConfigExport);

declare global {
  interface JSON {
    parse<T = unknown>(
      text: string,
      reviver?: (this: any, key: string, value: any) => any
    ): T;
  }
  interface Body {
    json<T = unknown>(): Promise<T>;
  }
  interface Response {
    json<T = unknown>(): Promise<T>;
  }
  interface ObjectConstructor {
    keys<T = object>(
      o: T
    ): (keyof T extends infer K
      ? K extends string
        ? K
        : K extends number
          ? `${K}`
          : never
      : never)[];
  }
}
