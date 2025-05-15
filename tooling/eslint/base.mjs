/// <reference types="./types.d.ts" />

import { join, relative } from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

const project = relative(process.cwd(), "tsconfig.json");

export default tseslint.config(
  includeIgnoreFile(join(import.meta.dirname, "../../.gitignore")),
  {
    // Globally ignored files
    ignores: [
      "**/*.config.*",
      "**/public/**",
      ".vscode/**/*.json",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/cache/**"
    ]
  },
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin,
      turbo: turboPlugin
    },
    ignores: ["stockfish.js", "**/*.config.*", "public/**/*.js", "**/node_modules/**", ".vscode/**/*.json"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked
    ],
    rules: {
      ...turboPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } }
      ],
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "no-unsafe-finally": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@next/next/no-page-custom-font": "off",
      // the following three rules are turned off due to existing errors eslint has when reading the source files
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/no-empty-function": "off"
    }
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { project } }
  }
);
