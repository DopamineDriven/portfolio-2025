import { Fs } from "@d0paminedriven/fs";
import type { BufferEncodingUnion } from "@d0paminedriven/fs";

type Opts = {
  encoding?: BufferEncodingUnion | null | undefined;
  withFileTypes?: false | undefined;
  recursive?: boolean | undefined;
};

type Targets = "src/ui" | "root" | "src/types" | "src/hooks" | "src/index";

class OutputMd extends Fs {
  constructor(public override cwd: string) {
    super((cwd ??= process.cwd()));
  }

  public getTargetedDirs(
    target: "src/ui" | "root" | "src/types" | "src/hooks" | "src/index",
    options = {
      encoding: "utf-8",
      recursive: true,
      withFileTypes: false
    } as Opts
  ) {
    if (target === "root") {
      const { recursive: re=false, ...opts } = options;
      return this.readDir(target, { recursive: re, ...opts })
        .filter(
          file =>
            /(?:(public|dist|patches|node_modules|\.(next|git|vscode|husky|changeset|github|turbo|gitignore|env)|pnpm-lock\.yaml))/g.test(
              file
            ) === false
        )
        .filter(file => /\./g.test(file) && !/\.md$/g.test(file));
    } else if (target === "src/index") {
      const { recursive: re=false, ...opts } = options;
      return this.readDir("src", { recursive: re, ...opts })
      .filter(
        file =>
          /(?:(services))/g.test(
            file
          ) === false
      ).filter(v => /\./g.test(v))
        .map(v => {
          return v;
        });
    } else
      return this.readDir(target, options)
        .filter(v => /\./g.test(v))
        .map(v => {
          return v;
        });
  }

  public get srcUi() {
    return this.getTargetedDirs("src/ui");
  }

  public get srcTypes() {
    return this.getTargetedDirs("src/types");
  }

  public get rootDir() {
    return this.getTargetedDirs("root");
  }

  public get srcHooks() {
    return this.getTargetedDirs("src/hooks");
  }
  public get srcIndex() {
    return this.getTargetedDirs("src/index");
  }

  public getTargetedPaths<const T extends Targets>(targeted: T) {
    return targeted === "src/ui"
      ? this.srcUi
      : targeted === "src/types"
        ? this.srcTypes
        : targeted === "src/hooks"
          ? this.srcHooks
          : targeted === "src/index"
            ? this.srcIndex
            : this.rootDir;
  }

  public fileExt(file: string) {
    return !file.startsWith(".")
      ? (file.split(/\./)?.reverse()?.[0] ?? "txt")
      : file.split(/\./gim)?.reverse()?.[0];
  }

  public handleComments<const T extends Targets>(
    target: T,
    file: string,
    removeComments = true
  ) {
    if (target === "root") {
      return file;
    } else if (!removeComments) {
      return file.trim();
    } else {
      return file.replace(
        // eslint-disable-next-line no-useless-escape
        /(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/gm,
        ""
      );
    }
  }

  public getRawFiles<const T extends Targets>(
    target: T,
    removeComments = true
  ) {
    const arr = Array.of<string>();
    try {
      return this.getTargetedPaths(target).map(file => {
        const handleInjectedTarget =
          target === "root" ? file : target === "src/index" ? `src/${file}` : `${target}/${file}`;
        const fileExtension = this.fileExt(file);
        const fileContent =
          this.fileToBuffer(handleInjectedTarget).toString("utf-8");

        // prettier-ignore
        const toInject = `**File:** \`${handleInjectedTarget}\`

For more details, [visit the raw version of this file](https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/refs/heads/master/packages/motion/${handleInjectedTarget}).

\`\`\`${fileExtension}

${this.handleComments(target, fileContent, removeComments)}

\`\`\`


**Related Resources:**
  - Raw file URL: https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/refs/heads/master/packages/motion/${handleInjectedTarget}


---

`
        arr.push(toInject);
        return toInject;
      });
    } catch (err) {
      console.error(err);
    } finally {
      return arr;
    }
  }
  public incomingArgs(argv: string[]) {
    const omitComments = argv[4]?.includes("false") ? false : true;
    // prettier-ignore
    const msg = `must provide an argv3 command, \n\n where val = index | root | ui | types | hooks \n\n eg, \n\n \`\`\`bash \npnpm tsx src/services/output-md.ts --target ui\n \`\`\``;

    if (argv[3] && argv[3].length > 1) {
      if (argv[3]?.includes("ui")) {
        this.withWs(
          "src/services/__out__/ui.md",
          this.getRawFiles("src/ui", omitComments).join("\n")
        );
      } else if (argv[3]?.includes("types")) {
        this.withWs(
          "src/services/__out__/types.md",
          this.getRawFiles("src/types", omitComments).join("\n")
        );
      } else if (argv[3]?.includes("index")) {
        this.withWs(
          "src/services/__out__/index.md",
          this.getRawFiles("src/index", omitComments).join("\n")
        );
      } else if (argv[3]?.includes("hooks")) {
        this.withWs(
          "src/services/__out__/hooks.md",
          this.getRawFiles("src/hooks", omitComments).join("\n")
        );
      } else if (argv[3]?.includes("root")) {
        this.withWs(
          "src/services/__out__/root.md",
          this.getRawFiles("root", omitComments).join("\n")
        );
      } else if (argv[3]?.includes("help")) {
        console.log(msg);
      } else {
        console.log(
          `argv3 val must be a valid value -- index | root | ui | types | hooks`
        );
      }
    } else {
      console.log(msg);
    }
  }
}
const fs = new OutputMd(process.cwd());

fs.incomingArgs(process.argv);
