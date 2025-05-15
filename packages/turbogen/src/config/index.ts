import { Fs } from "@d0paminedriven/fs";
import type { ToPascalCase } from "@/types/index.ts";

export class ConfigHandler extends Fs {
  constructor(public override cwd: string) {
    super((cwd ??= process.cwd()));
  }

  public readNpmrcConditional() {
    const path = `.npmrc` as const;
    if (this.exists(path)) {
      const fileContents = this.fileToBuffer(".npmrc").toString("utf-8");
      return [true, fileContents] as const;
    } else return [false, null] as const;
  }

  public get npmrcDefault() {
    // prettier-ignore
    return `enable-pre-post-scripts=true
node-linker=hoisted
auto-install-peers=true
` as const;
  }

  public handleNpmrc() {
    const arrHelper = Array.of<string>();
    const [doesExist, conditionalContents] = this.readNpmrcConditional();
    if (doesExist && typeof conditionalContents === "string") {
      arrHelper.push(conditionalContents);
      const file = conditionalContents;
      try {
        if (/enable-pre-post-scripts=true/g.test(file) === false) {
          arrHelper.push(`enable-pre-post-scripts=true`);
        }
        if (/node-linker=hoisted/g.test(file) === false) {
          arrHelper.push(`node-linker=hoisted`);
        }
        if (/link-workspace-packages=true/g.test(file) === false) {
          arrHelper.push("link-workspace-packages=true");
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new SyntaxError(error.message);
        } else if (error instanceof TypeError) {
          throw new TypeError(error.message);
        } else if (error instanceof RangeError) {
          throw new RangeError(error.message);
        } else if (error instanceof EvalError) {
          throw new EvalError(error.message);
        } else if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          console.error(error);
        }
      } finally {
        this.withWs(
          ".npmrc",
          arrHelper.length >= 1 ? arrHelper.join(`\n`) : conditionalContents
        );
      }
    } else {
      this.withWs(".npmrc", this.npmrcDefault);
    }
  }

  public hasNpmrcConfig() {
    return this.existsSync(".gitignore");
  }

  public isPlainObject(obj: unknown): obj is Record<string, unknown> {
    if (typeof obj === "undefined" || obj == null || typeof obj !== "object")
      return false;
    const proto = Reflect.getPrototypeOf(obj);
    // true for {} and Object.create(null)
    return proto === Object.prototype || proto === null;
  }

  public parseFileFromPath(path: string) {
    return /\//g.test(path) === true
      ? path?.split(/([/])/gim)?.reverse()?.[0]
      : path;
  }

  public kebabToCapital<const V extends string>(kebab: V) {
    return kebab
      .split(/(-)/g)
      .filter((_, i) => i % 2 === 0)
      .map(t => t.substring(0, 1).toUpperCase().concat(t.substring(1)))
      .join("") as ToPascalCase<typeof kebab>;
  }

  public toTitleCase<const T extends string>(value: T) {
    return this.kebabToCapital(value);
  }

  public calSansFont() {
    return this.fetchRemoteWriteLocalLargeFiles(
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/refs/heads/master/apps/web/public/fonts/CalSans-SemiBold.woff2",
      "public/fonts/CalSans-SemiBold"
    );
  }
}
