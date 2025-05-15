import type { PromptPropsBase } from "@/types/index.js";
import { ConfigHandler } from "@/config/index.js";

export class PrettierScaffolder extends ConfigHandler {
  constructor(
    public override cwd: string,
    public baseProps: PromptPropsBase
  ) {
    super((cwd ??= process.cwd()));
  }

  private get workspace() {
    return this.baseProps.workspace;
  }

  private get indexTemplate() {
    // prettier-ignore
    return `/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  importOrder: [
    "<TYPES>",
    "<TYPES>^@${this.workspace}",
    "^@${this.workspace}/(.*)$",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "<TYPES>^[.|..|@]",
    "^@/",
    "^~/",
    "^[../]",
    "^[./]"
  ],
  importOrderParserPlugins: [
    "typescript",
    "jsx",
    "decorators-legacy",
    "importAttributes"
  ],
  importOrderTypeScriptVersion: "5.6.3",
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  arrowParens: "avoid",
  useTabs: false,
  tabWidth: 2,
  bracketSameLine: true,
  jsxSingleQuote: false,
  bracketSpacing: true,
  quoteProps: "as-needed",
  printWidth: 80
};

export default config;
` as const;
  }

  private get pkgJsonTemplate() {
    // prettier-ignore
    return `{
  "name": "@${this.workspace}/prettier-config",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./index.mjs"
  },
  "scripts": {
    "clean": "git clean -xdf .turbo node_modules",
    "format": "prettier --check . --ignore-path ../../.gitignore",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@ianvs/prettier-plugin-sort-imports": "latest",
    "prettier": "latest",
    "prettier-plugin-tailwindcss": "latest"
  },
  "devDependencies": {
    "@${this.workspace}/tsconfig": "workspace:*",
    "typescript": "latest"
  },
  "prettier": "@${this.workspace}/prettier-config"
}
` as const;
  }

  private get tsconfigTemplate() {
    // prettier-ignore
    return `{
  "extends": "@${this.workspace}/tsconfig/base.json",
  "compilerOptions": {
    "tsBuildInfoFile": "node_modules/.cache/tsbuildinfo.json"
  },
  "include": ["."],
  "exclude": ["node_modules"]
}`as const;
  }

  private prettierPath<const F extends string>(file: F) {
    return `tooling/prettier/${file}` as const;
  }

  private get getPaths() {
    return {
      index: this.prettierPath("index.mjs"),
      packageJson: this.prettierPath("package.json"),
      tsconfig: this.prettierPath("tsconfig.json")
    } as const;
  }

  private prettierTarget<const V extends keyof typeof this.getPaths>(
    target: V
  ) {
    return this.getPaths[target];
  }

  private writeTarget<
    const T extends ReturnType<typeof this.prettierTarget>,
    const V extends string
  >(target: T, template: V) {
    return this.withWs(target, template);
  }

  public exePrettier() {
    return Promise.all([
      this.writeTarget("tooling/prettier/index.mjs", this.indexTemplate),
      this.writeTarget("tooling/prettier/package.json", this.pkgJsonTemplate),
      this.writeTarget("tooling/prettier/tsconfig.json", this.tsconfigTemplate)
    ]);
  }
}
