import { relative } from "node:path";
import type { Options } from "tsup";
import { defineConfig } from "tsup";

const tsupConfig = (options: Options) =>
  ({
    entry: [
      "src/index.ts",
      "src/bin/init.ts",
      "src/config/index.ts",
      "src/types/index.ts",
      "src/services/cli/index.ts",
      "src/services/cli/inquirer.ts",
      "src/services/scaffold/apps/generic-scaffold.ts",
      "src/services/scaffold/root/root-scaffolder.ts",
      "src/services/scaffold/tooling/eslint-scaffold.ts",
      "src/services/scaffold/tooling/jest-scaffold.ts",
      "src/services/scaffold/tooling/prettier-scaffold.ts",
      "src/services/scaffold/tooling/ts-scaffold.ts",
      "src/services/scaffold/index.ts",
      "!src/generated/**/*",
      "!src/config/test.ts",
      "!src/__generated__/**/*",
      "!src/test/**/*",
      "!public/**/*"
    ],
    target: ["esnext"],
    dts: true,
    watch: process.env.NODE_ENV === "development",
    keepNames: true,
    format: ["cjs", "esm"],
    shims: true,
    sourcemap: true,
    tsconfig: relative(process.cwd(), "tsconfig.json"),
    clean: true,
    outDir: "dist",
    ...options
  }) satisfies Options;

export default defineConfig(tsupConfig);
