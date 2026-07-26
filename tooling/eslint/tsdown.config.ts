import { relative } from "node:path";
import type { InlineConfig } from "tsdown";
import { defineConfig } from "tsdown";

export default defineConfig(
  options =>
    ({
      ...options,
      entry: ["index.ts", "react.ts", "next.ts", "base.ts"],
      cwd: process.cwd(),
      target: ["node26"],
      fixedExtension: false,
      dts: { tsgo: true },
      watch: process.env.NODE_ENV === "development",
      format: ["esm"],
      sourcemap: true,

      tsconfig: relative(process.cwd(), "tsconfig.json"),
      clean: true,
      outDir: "dist",
      unbundle: true
    }) satisfies InlineConfig
);
