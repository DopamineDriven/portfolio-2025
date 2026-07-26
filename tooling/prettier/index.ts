import type { PluginConfig } from "@ianvs/prettier-plugin-sort-imports";
import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";
export type WorkspacePrettierConfig =
  Config & PluginConfig & PluginOptions;
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  importOrder: [
    "<TYPES>",
    "^(openai(.*)$)|^(openai$)",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "<THIRD_PARTY_MODULES>",
    "<TYPES>^@portfolio",
    "^@portfolio/(.*)$",
    "<TYPES>^[.|..|~]",
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
  importOrderTypeScriptVersion: "6.0.3",
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
} satisfies WorkspacePrettierConfig;

export default config;
