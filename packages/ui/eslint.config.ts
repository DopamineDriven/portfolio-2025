import { defineConfig } from "eslint/config";
import { baseConfig, reactConfig } from "@portfolio/eslint-config";

export default defineConfig(
  {
    ignores: ["dist/**"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-includes": "off",
      "@typescript-eslint/prefer-string-starts-ends-with": "off",
      "@typescript-eslint/require-await": "off",
      "prefer-const": "off",
      "@typescript-eslint/no-empty-object-type": "off"
    }
  },
  baseConfig(process.cwd()),
  reactConfig
);
