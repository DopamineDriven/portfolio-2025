/** @typedef {import("prettier").Config} PrettierConfig */
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
    "<TYPES>^@portfolio",
    "^@portfolio/(.*)$",
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
