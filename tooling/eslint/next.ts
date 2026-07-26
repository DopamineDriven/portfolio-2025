import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "@eslint/config-helpers";

export const nextjsConfig = defineConfig({
  files: ["**/*.ts", "**/*.tsx"],
  plugins: {
    "@next/next": nextPlugin
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "@next/next/no-duplicate-head": "off",
    "@next/next/no-img-element": "off"
  }
});
