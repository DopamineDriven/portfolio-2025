import type { PromptPropsBase } from "@/types/index.js";
import { ConfigHandler } from "@/config/index.js";

export class TsScaffolder extends ConfigHandler {
  constructor(
    public override cwd: string,
    public baseProps: PromptPropsBase
  ) {
    super((cwd ??= process.cwd()));
  }

  private get workspace() {
    return this.baseProps.workspace;
  }

  private get baseTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "ES2022",
    "lib": ["ES2022", "ScriptHost"],
    "allowJs": true,
    "declaration": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "incremental": true,
    "disableSourceOfProjectReferenceRedirect": true,
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "checkJs": true,
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "noEmit": true
  },
  "exclude": ["node_modules", "build", "dist", ".next/cache"]
}
` as const;
  }

  private get expressTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ESNext", "ScriptHost"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ESNext",
    "incremental": true,
    "sourceMap": true,
    "useDefineForClassFields": true,
    "disableSourceOfProjectReferenceRedirect": false,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "importHelpers": true,
    "alwaysStrict": true
  }
}
` as const;
  }

  private get internalTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "noEmit": false,
    "emitDeclarationOnly": true
  }
}
` as const;
  }

  private get nodePkgTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "alwaysStrict": true,
    "module": "Node16",
    "moduleResolution": "NodeNext",
    "target": "ESNext",
    "incremental": true,
    "sourceMap": true,
    "useDefineForClassFields": true,
    "disableSourceOfProjectReferenceRedirect": false,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "importHelpers": false
  }
}
` as const;
  }

  private get nextTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "alwaysStrict": true,
    "module": "ESNext",
    "target": "ESNext",
    "incremental": true,
    "sourceMap": true,
    "useDefineForClassFields": true,
    "disableSourceOfProjectReferenceRedirect": false,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "importHelpers": false,
    "lib": ["ESNext", "DOM", "DOM.Iterable", "ScriptHost"]
  }
}` as const;
  }

  private get reactLibTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "alwaysStrict": true,
    "jsx": "react-jsx",
    "lib": ["DOM", "DOM.Iterable", "ESNext", "ScriptHost"],
    "jsxImportSource": "react",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ESNext",
    "incremental": false,
    "sourceMap": true,
    "useDefineForClassFields": true,
    "disableSourceOfProjectReferenceRedirect": false,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "importHelpers": false,
    "noEmit": true
  }
}
` as const;
  }

  private get cliPkgTemplate() {
    // prettier-ignore
    return `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "outDir": "dist",
    "alwaysStrict": true,
    "module": "Node16",
    "moduleResolution": "NodeNext",
    "target": "ESNext",
    "incremental": false,
    "sourceMap": true,
    "useDefineForClassFields": true,
    "disableSourceOfProjectReferenceRedirect": false,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "importHelpers": false,
    "baseUrl": "./",
    "noEmit": true
  }
}
` as const;
  }

  private get pkgJsonTemplate() {
    // prettier-ignore
    return `{
  "name": "@${this.workspace}/tsconfig",
  "private": true,
  "version": "0.1.0",
  "files": [
    "*.json"
  ]
}
` as const;
  }

  private tsPath<const F extends string>(file: F) {
    return `tooling/typescript/${file}` as const;
  }

  private getPaths() {
    return {
      base: this.tsPath("base.json"),
      express: this.tsPath("express.json"),
      internal: this.tsPath("internal.json"),
      next: this.tsPath("next.json"),
      nodePkg: this.tsPath("node-pkg.json"),
      packageJson: this.tsPath("package.json"),
      reactLib: this.tsPath("react-library.json"),
      cliPkg: this.tsPath("cli-pkg.json")
    } as const;
  }

  private tsTarget<const V extends keyof ReturnType<typeof this.getPaths>>(
    target: V
  ) {
    return this.getPaths()[target];
  }

  private writeTarget<
    const T extends ReturnType<typeof this.tsTarget>,
    const V extends string
  >(target: T, template: V) {
    return this.withWs(target, template);
  }

  public exeTs() {
    return Promise.all([
      this.writeTarget("tooling/typescript/cli-pkg.json", this.cliPkgTemplate),
      this.writeTarget("tooling/typescript/base.json", this.baseTemplate),
      this.writeTarget("tooling/typescript/express.json", this.expressTemplate),
      this.writeTarget(
        "tooling/typescript/internal.json",
        this.internalTemplate
      ),
      this.writeTarget("tooling/typescript/next.json", this.nextTemplate),
      this.writeTarget(
        "tooling/typescript/node-pkg.json",
        this.nodePkgTemplate
      ),
      this.writeTarget("tooling/typescript/package.json", this.pkgJsonTemplate),
      this.writeTarget(
        "tooling/typescript/react-library.json",
        this.reactLibTemplate
      )
    ]);
  }
}
