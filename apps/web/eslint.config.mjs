import baseConfig from "@portfolio/eslint-config/base";
import nextjsConfig from "@portfolio/eslint-config/next";
import reactConfig from "@portfolio/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  {
    ignores: [".next/**", "!.next/types/**/*"],
    // https://typescript-eslint.io/troubleshooting/typed-linting/performance#eslint-plugin-import
    rules: {
      "@typescript-eslint/consistent-type-assertions": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/prefer-string-starts-ends-with": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "@typescript-eslint/prefer-find": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "import/consistent-type-specifier-style": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-for-of": "off",
      "@typescript-eslint/await-thenable": "off"
    }
  }
];
