import type { PromptPropsBase } from "@/types/index.js";
import { ConfigHandler } from "@/config/index.js";

export class JestScaffolder extends ConfigHandler {
  constructor(
    public override cwd: string,
    public baseProps: PromptPropsBase
  ) {
    super((cwd ??= process.cwd()));
  }

  private get workspace() {
    return this.baseProps.workspace;
  }

  private get browserTemplate() {
    // prettier-ignore
    return `module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist"
  ],
  preset: "ts-jest"
};` as const;
  }

  private get nodeTemplate() {
    // prettier-ignore
    return `/**
 * @type {import("ts-jest").ConfigSet}
 */
module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.(m|c)?(j|t)sx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "cts",
    "mts",
    "mjs",
    "cjs",
    "js",
    "jsx",
    "json",
    "json5",
    "node"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist"
  ],
  preset: "ts-jest"
};
` as const;
  }

  private get pkgJsonTemplate() {
    // prettier-ignore
    return `{
  "name": "@${this.workspace}/jest-presets",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "files": [
    "browser/jest-preset.js",
    "node/jest-preset.js"
  ],
  "scripts": {
    "clean": "git clean -xdf node_modules"
  },
  "peerDependencies": {
    "jest": "latest"
  },
  "dependencies": {
    "ts-jest": "latest"
  },
  "devDependencies": {
    "@${this.workspace}/prettier-config": "workspace:*",
    "@${this.workspace}/tsconfig": "workspace:*",
    "jest-environment-jsdom": "latest",
    "prettier": "latest",
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
}
`as const;
  }

  private jestPath<const F extends string>(file: F) {
    return `tooling/jest-presets/${file}` as const;
  }

  private get getPaths() {
    return {
      browser: this.jestPath("browser/jest-preset.js"),
      node: this.jestPath("node/jest-preset.js"),
      packageJson: this.jestPath("package.json"),
      tsconfig: this.jestPath("tsconfig.json")
    } as const;
  }

  private jestPresetsTarget<
    const V extends keyof typeof this.getPaths
  >(target: V) {
    return this.getPaths[target];
  }

  private writeTarget<
    const T extends ReturnType<typeof this.jestPresetsTarget>,
    const V extends string
  >(target: T, template: V) {
    return this.withWs(target, template);
  }

  public exeJestPresets() {
    return Promise.all([
      this.writeTarget(
        "tooling/jest-presets/browser/jest-preset.js",
        this.browserTemplate
      ),
      this.writeTarget(
        "tooling/jest-presets/node/jest-preset.js",
        this.nodeTemplate
      ),
      this.writeTarget(
        "tooling/jest-presets/package.json",
        this.pkgJsonTemplate
      ),
      this.writeTarget(
        "tooling/jest-presets/tsconfig.json",
        this.tsconfigTemplate
      )
    ]);
  }
}
