import type { PromptPropsBase } from "@/types/index.js";
import { ConfigHandler } from "@/config/index.js";

export class EslintScaffolder extends ConfigHandler {
  constructor(
    public override cwd: string,
    public baseProps: PromptPropsBase
  ) {
    super((cwd ??= process.cwd()));
  }

  private get workspace() {
    return this.baseProps.workspace;
  }

  private get baseScaffold() {
    // prettier-ignore
    return `/// <reference types="./types.d.ts" />

import { join, relative } from "node:path";
import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";

const project = relative(process.cwd(), "tsconfig.json");

export default tseslint.config(
  includeIgnoreFile(join(import.meta.dirname, "../../.gitignore")),
  {
    // Globally ignored files
    ignores: [
      "**/*.config.js",
      "**/*.config.mjs",
      "**/*.config.cjs",
      "tailwind.config.ts",
      "tsup.config.ts",
      "**/*.presets.cjs"
    ]
  },
  {
    files: [
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs",
      "**/*.ts",
      "**/*.tsx",
      "**/*.jsx",
      "**/*.mts",
      "**/*.cts"
    ],
    plugins: {
      import: importPlugin,
      turbo: turboPlugin
    },
    ignores: [
      "tailwind.config.ts",
      "tsup.config.ts",
      "**/*.config.mjs",
      "**/*.config.js",
      "**/*.config.cjs",
      "**/*.presets.cjs"
    ],
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
` as const;
  }

  private get nextScaffold() {
    // prettier-ignore
    return `import nextPlugin from "@next/eslint-plugin-next";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
      "import/no-default-export": "off"
    }
  }
];` as const;
  }

  private get reactScaffold() {
    // prettier-ignore
    return `import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules
    },
    languageOptions: {
      globals: {
        React: "writable"
      }
    }
  }
];
` as const;
  }

  private get pkgJsonScaffold() {
    // prettier-ignore
    return `{
  "name": "@${this.workspace}/eslint-config",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "./base": "./base.js",
    "./next": "./next.js",
    "./react": "./react.js"
  },
  "license": "MIT",
  "scripts": {
    "clean": "git clean -xdf .cache .turbo node_modules",
    "format": "prettier --check . --ignore-path ../../.gitignore",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@eslint/compat": "^1.1.1",
    "@next/eslint-plugin-next": "latest",
    "eslint-config-turbo": "latest",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-turbo": "latest",
    "typescript-eslint": "latest"
  },
  "devDependencies": {
    "@${this.workspace}/prettier-config": "workspace:*",
    "@${this.workspace}/tsconfig": "workspace:*",
    "eslint": "latest",
    "prettier": "latest",
    "typescript": "latest"
  },
  "prettier": "@${this.workspace}/prettier-config"
}` as const;
  }

  private get tsconfigScaffold() {
    // prettier-ignore
    return `{
  "extends": "@${this.workspace}/tsconfig/base.json",
  "compilerOptions": {
    "tsBuildInfoFile": "node_modules/.cache/tsbuildinfo.json"
  },
  "include": ["**/*"],
  "exclude": ["node_modules"]
}`as const;
  }

  private get dtsScaffold() {
    // prettier-ignore
    return `declare module "@eslint/js" {
  import type { Linter } from "eslint";

  export const configs: {
    readonly recommended: { readonly rules: Readonly<Linter.RulesRecord> };
    readonly all: { readonly rules: Readonly<Linter.RulesRecord> };
  };
}

declare module "eslint-plugin-import" {
  import type { Linter, Rule } from "eslint";

  export const configs: {
    recommended: { rules: Linter.RulesRecord };
  };
  export const rules: Record<string, Rule.RuleModule>;
}

declare module "eslint-plugin-react" {
  import type { Linter, Rule } from "eslint";

  export const configs: {
    recommended: { rules: Linter.RulesRecord };
    all: { rules: Linter.RulesRecord };
    "jsx-runtime": { rules: Linter.RulesRecord };
  };
  export const rules: Record<string, Rule.RuleModule>;
}

declare module "eslint-plugin-react-hooks" {
  import type { Linter, Rule } from "eslint";

  export const configs: {
    recommended: {
      rules: {
        "rules-of-hooks": Linter.RuleEntry;
        "exhaustive-deps": Linter.RuleEntry;
      };
    };
  };
  export const rules: Record<string, Rule.RuleModule>;
}

declare module "@next/eslint-plugin-next" {
  import type { Linter, Rule } from "eslint";

  export const configs: {
    recommended: { rules: Linter.RulesRecord };
    "core-web-vitals": { rules: Linter.RulesRecord };
  };
  export const rules: Record<string, Rule.RuleModule>;
}

declare module "eslint-plugin-turbo" {
  import type { Linter, Rule } from "eslint";

  export const configs: {
    recommended: { rules: Linter.RulesRecord };
  };
  export const rules: Record<string, Rule.RuleModule>;
}
` as const;
  }

  private eslintPath<const F extends string>(file: F) {
    return `tooling/eslint/${file}` as const;
  }

  private get getPaths() {
    return {
      base: this.eslintPath("base.js"),
      next: this.eslintPath("next.js"),
      packageJson: this.eslintPath("package.json"),
      react: this.eslintPath("react.js"),
      tsconfig: this.eslintPath("tsconfig.json"),
      types: this.eslintPath("types.d.ts")
    } as const;
  }

  private eslintTarget<const V extends keyof typeof this.getPaths>(
    target: V
  ) {
    return this.getPaths[target];
  }

  private writeTarget<
    const T extends ReturnType<typeof this.eslintTarget>,
    const V extends string
  >(target: T, template: V) {
    return this.withWs(target, template);
  }

  public exeEslint() {
    return Promise.all([
      this.writeTarget("tooling/eslint/base.js", this.baseScaffold),
      this.writeTarget("tooling/eslint/next.js", this.nextScaffold),
      this.writeTarget("tooling/eslint/package.json", this.pkgJsonScaffold),
      this.writeTarget("tooling/eslint/react.js", this.reactScaffold),
      this.writeTarget("tooling/eslint/tsconfig.json", this.tsconfigScaffold),
      this.writeTarget("tooling/eslint/types.d.ts", this.dtsScaffold)
    ]);
  }
}
