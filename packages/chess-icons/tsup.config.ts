import { relative } from "node:path";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

const tsupConfig = (options: Options) =>
  ({
    entry: [
      "src/index.ts",
      "src/icons/*.tsx",
      "src/types/index.ts",
      "!public/**/*"
    ],
    target: ["esnext"],
    external: ["react"],
    dts: true,
    watch: process.env.NODE_ENV === "development",
    keepNames: true,
    format: ["cjs", "esm"],
    sourcemap: true,
    tsconfig: relative(process.cwd(), "tsconfig.json"),
    clean: true,
    outDir: "dist",
    ...options
  }) satisfies Options;

export default defineConfig(tsupConfig);
