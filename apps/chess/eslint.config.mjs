import baseConfig from "@portfolio/eslint-config/base";
import nextjsConfig from "@portfolio/eslint-config/next";
import reactConfig from "@portfolio/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  {
    ignores: [".next/**", "!.next/types/**/*", "public/scripts/stockfish.js"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "import/consistent-type-specifier-style": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off"
    }
  }
];
