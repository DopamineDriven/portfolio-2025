import type { PromptPropsBase } from "@/types/index.js";
import { ConfigHandler } from "@/config/index.js";

export class RootScaffolder extends ConfigHandler {
  constructor(
    public override cwd: string,
    public baseProps: PromptPropsBase
  ) {
    super((cwd ??= process.cwd()));
  }

  private get workspace() {
    return this.baseProps.workspace;
  }

  private resolveRootPkgJson() {
    return JSON.parse(this.fileToBuffer("package.json").toString("utf-8")) as
      | {
          repository?: string;
          [record: string]: unknown;
        }
      | {
          repository?: string;
          author?: string | Record<string, string>;
          [record: string]: unknown;
        };
  }

  private pkgJsonRepo() {
    return this.resolveRootPkgJson().repository;
  }

  private get packageManager() {
    if (process.env.npm_config_user_agent) {
      return `pnpm@${/pnpm\/([0-9]+.[0-9]+.[0-9]+)/g.exec(process.env.npm_config_user_agent)?.[1]}` as const;
    } else return `pnpm` as const;
  }

  private get pkgJsonTemplate() {
    const repo = this.pkgJsonRepo();
    if (repo) {
      // prettier-ignore
      return `{
  "repository": "${repo}",
  "name": "@${this.workspace}/root",
  "license": "MIT",
  "private": true,
  "packageManager": "${this.packageManager}",
  "scripts": {
    "build:web": "turbo build --filter=@${this.workspace}/web",
    "changeset": "changeset",
    "clean": "git clean -xdf node_modules",
    "dev": "turbo dev --parallel --continue",
    "format": "prettier --write \\"**/*.{ts,tsx,cts,mts,js,jsx,mjs,cjs,json,yaml,yml,css,html,md,mdx}\\" --ignore-unknown --cache",
    "lint": "turbo lint",
    "prepare": "husky",
    "typecheck": "turbo typecheck",
    "npm:registry": "npm set registry https://registry.npmjs.org",
    "clean:house": "cd apps/web && git clean -xdf node_modules .next .turbo && cd ../..tooling/eslint && git clean -xdf node_modules .turbo && cd ../prettier && git clean -xdf node_modules .turbo && cd ../typescript && git clean -xdf .turbo node_modules && cd ../jest-presets && git clean -xdf node_modules .turbo && cd ../.. && git clean -xdf node_modules pnpm-lock.yaml && pnpm install",
    "generate:base64": "openssl rand -base64 64",
    "generate:hex": "openssl rand -hex 64",
    "run:web": "turbo dev --filter=@${this.workspace}/web",
    "sync:time": "sudo ntpdate time.windows.com",
    "latest:pnpm": "corepack use pnpm@latest",
    "update:pnpm": "curl -fsSL https://get.pnpm.io/install.sh | sh -"
  },
  "devDependencies": {
    "@changesets/cli": "latest",
    "@${this.workspace}/eslint-config": "workspace:*",
    "@${this.workspace}/prettier-config": "workspace:*",
    "@${this.workspace}/tsconfig": "workspace:*",
    "@d0paminedriven/turbogen": "latest",
    "@types/node": "latest",
    "dotenv": "latest",
    "dotenv-cli": "latest",
    "dotenv-expand": "latest",
    "eslint": "latest",
    "husky": "latest",
    "jiti": "latest",
    "prettier": "latest",
    "tsx": "latest",
    "turbo": "latest",
    "typescript": "latest",
    "vercel": "latest"
  },
  "prettier": "@${this.workspace}/prettier-config",
  "engines": {
    "node": ">=20",
    "npm": ">=10",
    "pnpm": ">=9"
  }
}
`  as const
    } else {
      // prettier-ignore
      return `{
  "name": "@${this.workspace}/root",
  "license": "MIT",
  "private": true,
  "packageManager": "${this.packageManager}",
  "scripts": {
    "build:web": "turbo build --filter=@${this.workspace}/web",
    "changeset": "changeset",
    "clean": "git clean -xdf node_modules",
    "dev": "turbo dev --parallel --continue",
    "format": "prettier --write \\"**/*.{ts,tsx,cts,mts,js,jsx,mjs,cjs,json,yaml,yml,css,html,md,mdx}\\" --ignore-unknown --cache",
    "lint": "turbo lint",
    "prepare": "husky",
    "typecheck": "turbo typecheck",
    "clean:house": "cd tooling/eslint && git clean -xdf node_modules .turbo && cd ../prettier && git clean -xdf node_modules .turbo && cd ../typescript && git clean -xdf .turbo node_modules && cd ../jest-presets && git clean -xdf node_modules .turbo && cd ../.. && git clean -xdf node_modules pnpm-lock.yaml && pnpm install",
    "generate:base64": "openssl rand -base64 64",
    "generate:hex": "openssl rand -hex 64",
    "npm:registry": "npm set registry https://registry.npmjs.org",
    "run:web": "turbo dev --filter=@${this.workspace}/web",
    "latest:pnpm": "corepack use pnpm@latest",
    "update:pnpm": "curl -fsSL https://get.pnpm.io/install.sh | sh -"
  },
  "devDependencies": {
    "@changesets/cli": "latest",
    "@${this.workspace}/eslint-config": "workspace:*",
    "@${this.workspace}/prettier-config": "workspace:*",
    "@${this.workspace}/tsconfig": "workspace:*",
    "@d0paminedriven/turbogen": "latest",
    "@types/node": "latest",
    "dotenv": "latest",
    "dotenv-cli": "latest",
    "dotenv-expand": "latest",
    "eslint": "latest",
    "husky": "latest",
    "prettier": "latest",
    "tsx": "latest",
    "turbo": "latest",
    "typescript": "latest"
  },
  "prettier": "@${this.workspace}/prettier-config",
  "engines": {
    "node": ">=22",
    "npm": ">=10",
    "pnpm": ">=9"
  }
}
` as const
    }
  }

  private get eslintTemplate() {
    // prettier-ignore
    return `import baseConfig from "@${this.workspace}/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": "off"
    },
    ignores: ["**node_modules**"]
  },
  ...baseConfig
];
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

  private get vscodeExtensionsTemplate() {
    // prettier-ignore
    return `{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "donjayamanne.githistory",
    "eamodio.gitlens",
    "editorconfig.editorconfig",
    "esbenp.prettier-vscode",
    "ghmcadams.lintlens",
    "hilleer.yaml-plus-json",
    "ipatalas.vscode-postfix-ts",
    "meganrogge.template-string-converter",
    "meouwu.css-var-color-decorator",
    "ms-vscode.vscode-typescript-next",
    "pascalreitermann93.vscode-yaml-sort",
    "redhat.vscode-yaml",
    "redis.redis-for-vscode",
    "rvest.vs-code-prettier-eslint",
    "visualstudioexptteam.intellicode-api-usage-examples",
    "visualstudioexptteam.vscodeintellicode",
    "xshrim.txt-syntax",
    "yoavbls.pretty-ts-errors",
    "yutengjing.vscode-versionlens-plus"
  ],
  "unwantedRecommendations": []
}` as const;
  }

  private get vscodeSettingsTemplate() {
    // prettier-ignore
    return `{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[postcss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "C_Cpp.dimInactiveRegions": false,
  "css.completion.completePropertyWithSemicolon": true,
  "css.format.enable": true,
  "css.format.newlineBetweenSelectors": true,
  "css.hover.documentation": true,
  "css.hover.references": true,
  "editor.bracketPairColorization.enabled": false,
  "svg.preview.autoShow": false,
  "svg.preview.disable": true,
  "svg.preview.mode": "svg",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.suggest.showStatusBar": true,
  "eslint.enable": true,
  "eslint.useFlatConfig": true,
  "eslint.rules.customizations": [
    {
      "rule": "*",
      "severity": "warn"
    }
  ],
  "eslint.workingDirectories": [
    {
      "pattern": "apps/*/"
    },
    {
      "pattern": "packages/*/"
    },
    {
      "pattern": "tooling/*/"
    }
  ],
  "files.autoSave": "afterDelay",
  "javascript.referencesCodeLens.showOnAllFunctions": true,
  "openInDefaultBrowser.run.openWithLocalHttpServer": false,
   "openInDefaultBrowser.run.openWithLocalHttpServer": false,
  "tailwindCSS.experimental.classRegex": [
    [
      "cva\\(([^)]*)\\)",
      "[\\"'\`]([^\\"'\`]*).*?[\\"'\`]"
    ],
    [
      "cx\\(([^)]*)\\)",
      "(?:'|\\"|\`)([^']*)(?:'|\\"|\`)"
    ]
  ],
  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "classNames",
    "ngClass",
    "rootClassName",
    ".*Variant.*",
    ".*variant.*",
    ".*Styles.*"
  ],
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "typescript.tsserver.web.typeAcquisition.enabled": true,
  "typescript.implementationsCodeLens.enabled": true,
  "typescript.implementationsCodeLens.showOnInterfaceMethods": true,
  "typescript.locale": "en",
  "typescript.referencesCodeLens.enabled": true,
  "typescript.referencesCodeLens.showOnAllFunctions": true,
  "typescript.tsdk": "node_modules/typescript/lib",
  "yaml.hover": true,
  "yaml.validate": true,
  "workbench.editor.autoLockGroups": {
    "default": false
  },
  "github.copilot.enable": {
    "*": false,
    "plaintext": false,
    "markdown": false,
    "scminput": false
  }
}` as const;
  }

  private get editorConfigTemplate() {
    // prettier-ignore
    return `[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
tab_width = 4
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
trim_trailing_whitespace = false

[COMMIT_EDITMSG]
max_line_length = 0

[{*.c,*.cc,*.h,*.hh,*.cpp,*.hpp,*.m,*.mm,*.mpp,*.js,*.cjs,*.mjs,*.mts,*.cts,*.java,*.go,*.rs,*.php,*.ng,*.jsx,*.ts,*.tsx,*.d,*.cs,*.swift}]
curly_bracket_next_line = false
spaces_around_operators = true
spaces_around_brackets = outside

# close enough to 1TB
indent_brace_style = K&R

[*.module.css]
max_line_length = 40
` as const;
  }

  private get turboJsonTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://turborepo.org/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": []
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  },
  "ui": "stream",
  "globalEnv": [
    "__NEXT_PROCESSED_ENV",
    "AUTH_TOKEN",
    "CI_ENV",
    "COREPACK_ENABLE_STRICT",
    "GA_MEASUREMENT_ID",
    "GA_PROTOCOL_SECRET",
    "GA_STREAM_ID",
    "GITHUB_PAT",
    "MY_GITHUB_PAT",
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    "NEXT_PUBLIC_MEASUREMENT_PROTOCOL_SECRET",
    "NEXT_PUBLIC_GA_PROTOCOL_SECRET",
    "NEXT_PUBLIC_GA_STREAM_ID",
    "NPM_RC",
    "npm_config_user_agent",
    "NO_COLOR",
    "NODE_ENV",
    "NPM_TOKEN",
    "PORT",
    "VERCEL_ENV",
    "VERCEL_GIT_PROVIDER",
    "VERCEL_GIT_REPO_OWNER",
    "VERCEL_GIT_REPO_SLUG",
    "VERCEL_URL"
  ]
}
` as const;
  }

  private get pnpmWorkspaceYamlTemplate() {
    // prettier-ignore
    return `packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"` as const;
  }

  private get gitignoreTemplate() {
    // prettier-ignore
    return `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# next.js
.next/
out/
build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
# turbo
.turbo
.vercel
.npmrc

.idea
dist
notes.md` as const;
  }

  private get prettierignoreTemplate() {
    //prettier-ignore
    return `node_modules/*
.next
dist
.changeset
generated
*.md
pnpm-lock.yaml
.tsup
` as const;
  }

  private getPaths() {
    return {
      editorConfig: `.editorconfig`,
      eslint: `eslint.config.mjs`,
      gitignore: ".gitignore",
      packageJson: "package.json",
      pnpmWorkspaceYaml: "pnpm-workspace.yaml",
      prettierignore: ".prettierignore",
      tsconfig: `tsconfig.json`,
      turboJson: `turbo.json`,
      vscodeExtensions: ".vscode/extensions.json",
      vscodeSettings: `.vscode/settings.json`
    } as const;
  }

  private rootTarget<const V extends keyof ReturnType<typeof this.getPaths>>(
    target: V
  ) {
    return this.getPaths()[target];
  }

  private writeTarget<
    const T extends ReturnType<typeof this.rootTarget>,
    const V extends string
  >(target: T, template: V) {
    return this.withWs(target, template);
  }

  public exeRoot() {
    return Promise.all([
      this.handleNpmrc(),
      this.writeTarget(".prettierignore", this.prettierignoreTemplate),
      this.writeTarget(
        ".vscode/extensions.json",
        this.vscodeExtensionsTemplate
      ),
      this.writeTarget(".vscode/settings.json", this.vscodeSettingsTemplate),
      this.writeTarget(".editorconfig", this.editorConfigTemplate),
      this.writeTarget(".gitignore", this.gitignoreTemplate),
      this.writeTarget("eslint.config.mjs", this.eslintTemplate),
      this.writeTarget("package.json", this.pkgJsonTemplate),
      this.writeTarget("pnpm-workspace.yaml", this.pnpmWorkspaceYamlTemplate),
      this.writeTarget("tsconfig.json", this.tsconfigTemplate),
      this.writeTarget("turbo.json", this.turboJsonTemplate)
    ]);
  }
}
