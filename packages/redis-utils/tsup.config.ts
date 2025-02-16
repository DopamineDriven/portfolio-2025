import { relative } from "node:path";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

const tsupConfig = (options: Options) =>
  ({
    entry: [
      "src/index.ts",
      "src/redis.ts",
      "src/env.ts",
      "!src/__generated__/**/*",
      "!src/__tests__/**/*",
      "!public/**/*"
    ],
    target: ["esnext"],
    dts: true,
    watch: process.env.NODE_ENV === "development",
    keepNames: true,
    format: ["cjs", "esm"],
    shims: true,
    sourcemap: true,
    cjsInterop: true,
    tsconfig: relative(process.cwd(), "tsconfig.json"),
    clean: true,
    outDir: "dist",
    // onSuccess: process.env.NODE_ENV === "development" ? "node dist/index.js" : undefined,
    ...options
  }) satisfies Options;

export default defineConfig(tsupConfig);
