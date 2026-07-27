import { relative } from "node:path";
import type { UserConfig as Options } from "tsdown";
import { defineConfig } from "tsdown";

export default defineConfig(
  options =>
    ({
      ...options,
      entry: [
        "src/globals.css",
        "src/index.ts",
        "src/icons/index.tsx",
        "src/base/*.tsx",
        "src/hooks/*.ts",
        "src/lib/*.ts",
        "src/ui/*.tsx",
        "!src/services/icon-workup.ts",
        "!src/services/postbuild.ts"
      ],
      dts: { tsgo: true },
      external: ["react"],
      platform: "neutral",
      fixedExtension: false,
      target: ["esnext"],
      format: ["esm"],
      tsconfig: relative(process.cwd(), "tsconfig.json"),
      cwd: process.cwd(),
      clean: true,
      outDir: "dist",
      unbundle: true,
      css: {
        fileName: "globals.css",
        inject: false,
        minify: false,
        transformer: "postcss"      }
    }) satisfies Options
);
