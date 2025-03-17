import { relative } from "node:path";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

const tsupConfig = (options: Options) =>
  ({
    entry: [
      "src/index.ts",
      "src/hooks/use-resize-observer.ts",
      "src/types/helpers.ts",
      "src/types/scatter-text.ts",
      "src/types/split-text.ts",
      "src/types/wave-text.ts",
      "src/ui/scatter-text.tsx",
      "!src/services/postbuild.ts"
    ],
    // esbuildOptions: (options, _) => {
    //   options.keepNames = true;
    //   options.minifyIdentifiers = false;
    // },
    // minifyIdentifiers: false,
    // banner: { js: '"use client"' },
    dts: true,
external: ["react"],
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
